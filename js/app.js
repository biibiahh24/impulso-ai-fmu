(()=>{'use strict';const $=id=>document.getElementById(id),fmt=n=>Number(n).toLocaleString('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}),num=id=>Math.max(0,Number($(id).value)||0);let currentProcess='Triagem de solicitações';function show(id){document.querySelectorAll('.screen').forEach(e=>e.classList.toggle('active',e.id===id));document.querySelectorAll('nav button').forEach(e=>e.classList.toggle('active',e.dataset.tab===id));if(id==='relatorio'&&typeof buildReport==='function')buildReport();window.scrollTo({top:0,behavior:'smooth'})}document.querySelectorAll('[data-tab],[data-go]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.tab||b.dataset.go)));
function updateReadiness(){const dims=[['Dados','dados'],['Equipe','equipe'],['Integração','integracao'],['Segurança','seguranca']];$('readinessBreakdown').innerHTML=dims.map(([label,id])=>{let p=Number($(id).value)*5;return '<div class="readiness-row"><div class="readiness-head"><span>'+label+'</span><span>'+p+'%</span></div><div class="readiness-track"><div class="readiness-fill" style="width:'+p+'%"></div></div></div>'}).join('')}
['dados','equipe','integracao','seguranca'].forEach(id=>$(id).addEventListener('change',updateReadiness));updateReadiness();
function updateVisuals(benefit,cost,net){const max=Math.max(benefit,cost,Math.max(0,net),1),scale=n=>Math.max(2,Math.round(Math.max(0,n)/max*100));[['Benefit',benefit],['Cost',cost],['Net',net]].forEach(([id,value])=>{$('dash'+id).textContent=fmt(value);$('dash'+id+'Bar').style.height=scale(value)+'%'});$('roiVisual').innerHTML=[['Capacidade econômica potencial',benefit,''],['Custo de contratação',cost,'cost'],['Saldo econômico projetado',net,'']].map(([label,value,cls])=>'<div class="scenario-item '+cls+'"><div><span>'+label+'</span><strong>'+fmt(value)+'</strong></div><div class="scenario-track"><div style="width:'+scale(value)+'%"></div></div></div>').join('');$('roiInterpretation').textContent=net>0?'Cenário positivo apenas sob as premissas inseridas; não equivale a lucro ou economia comprovada.':net<0?'Com estas premissas, os custos excedem o benefício econômico potencial.':'Com estas premissas, benefícios e custos estimados são equivalentes.'}

/* Validação operacional — o MVP nunca aprova projeções inconsistentes. */
const formLimits={
 vol:[1,100000,'Solicitações por dia'],pessoas:[1,100000,'Funcionários'],dias:[1,31,'Dias úteis por mês'],
 minutos:[0,480,'Minutos por pessoa/dia'],minutosPorCaso:[0,480,'Minutos poupados por solicitação'],
 hora:[0,1000000,'Custo-hora'],mensal:[0,100000000,'Mensalidade'],implantacao:[0,100000000,'Implantação'],
 extras:[0,100000000,'Custos extras'],realizacao:[0,100,'Aproveitamento econômico'],
 economiaCaixa:[0,100000000,'Economia anual em caixa'],
 pilotTempoAtual:[0.1,600,'Tempo atual por solicitação'],pilotTempoMeta:[0.1,600,'Meta de tempo por solicitação'],
 pilotErroAtual:[0,100,'Retrabalho atual'],pilotErroMeta:[0,100,'Meta de retrabalho'],pilotDias:[1,180,'Dias úteis de piloto']
};
function validateScenario(showErrors=false){
 const errors=[],invalid=new Set();
 const add=(id,msg)=>{errors.push(msg);invalid.add(id)};
 if(!$('empresaNome').value.trim())add('empresaNome','Informe o nome da empresa.');
 if(!$('proc').value.trim())add('proc','Informe o processo avaliado.');
 if(!$('desc').value.trim())add('desc','Descreva a atividade avaliada.');
 for(const [id,[lo,hi,label]] of Object.entries(formLimits)){
  const raw=$(id).value.trim(),n=Number(raw);
  if(!raw||!Number.isFinite(n)||n<lo||n>hi)add(id,label+': informe um valor entre '+lo+' e '+hi+'.');
 }
 const people=Number($('pessoas').value),volume=Number($('vol').value),
 perCase=Number($('minutosPorCaso').value),manual=Number($('minutos').value);
 const perPerson=$('metodoTempo').value==='volume'&&people>0?volume*perCase/people:manual;
 if(Number.isFinite(perPerson)&&perPerson>480)add($('metodoTempo').value==='volume'?'minutosPorCaso':'minutos','O tempo poupado excede 8 horas por pessoa/dia. Reduza o volume, o tempo por caso ou revise a equipe.');
 if(Number($('pilotTempoMeta').value)>Number($('pilotTempoAtual').value))add('pilotTempoMeta','A meta do piloto deve ser menor ou igual ao tempo atual.');
 if(Number($('pilotErroMeta').value)>Number($('pilotErroAtual').value))add('pilotErroMeta','A meta de retrabalho deve ser menor ou igual à taxa atual.');
 const annualCost=Number($('mensal').value)*12+Number($('implantacao').value)+Number($('extras').value);
 if(Number.isFinite(annualCost)&&annualCost<=0)add('mensal','Informe pelo menos um custo de implantação ou operação. Sem custo não é possível calcular ROI.');
 if(showErrors){
  Object.keys(formLimits).concat(['empresaNome','proc','desc']).forEach(id=>$(id).setAttribute('aria-invalid',invalid.has(id)?'true':'false'));
  const html=errors.length?'<strong>Confira os dados antes de continuar:</strong><ul>'+errors.map(v=>'<li>'+safe(v)+'</li>').join('')+'</ul>':'';
  $('diagnosticValidation').innerHTML=html;$('roiValidation').innerHTML=html;
 }
 return {ok:!errors.length,errors};
}
function updateDashboard(){
 const score=Number($('score').textContent)||0;
 const valid=validateScenario(false);
 $('dashReadiness').textContent=diagnosisDone?score+'/100':'Não avaliada';
 $('dashReadinessDetail').textContent=diagnosisDone?(blocked?'Dados ou segurança insuficientes':'Diagnóstico registrado'):'Clique em Analisar prontidão';
 $('dashDecision').textContent=approvalState==='approved'?'Aprovada':approvalState==='review'?'Em revisão':blocked&&diagnosisDone?'Bloqueada':'Pendente';
 $('dashDecisionDetail').textContent=approvalState==='approved'?'Aprovação somente demonstrativa':approvalState==='review'?'Necessita nova avaliação':'Nenhuma implementação ativada';
 const days=Number($('dias').value)||0,vol=Number($('vol').value)||0;
 $('dashVolume').textContent=(days*vol).toLocaleString('pt-BR');
 $('dashVolumeDetail').textContent=vol.toLocaleString('pt-BR')+' casos/dia × '+days+' dias';
 $('dashChecks').textContent=!valid.ok?'Revisar dados':blocked?'Controles pendentes':diagnosisDone?'Verificados':'Em preparação';
 $('dashChecksDetail').textContent=!valid.ok?valid.errors[0]:blocked?'O diagnóstico não permite prosseguir':'Valores e premissas do cenário';
}
function renderPilot(){
 const volume=num('vol'),days=num('pilotDias'),current=num('pilotTempoAtual'),target=num('pilotTempoMeta'),
 oldError=num('pilotErroAtual'),newError=num('pilotErroMeta'),total=volume*days;
 const timeSaved=total*Math.max(0,current-target)/60;
 $('pilotResults').innerHTML='<div class="pilot-results-grid"><div><span>Solicitações estimadas no piloto</span><strong>'+total.toLocaleString('pt-BR')+'</strong></div><div><span>Horas que se pretende liberar</span><strong>'+timeSaved.toLocaleString('pt-BR',{maximumFractionDigits:1})+' h</strong></div><div><span>Meta de redução no tempo</span><strong>'+(current>0?((current-target)/current*100):0).toLocaleString('pt-BR',{maximumFractionDigits:1})+'%</strong></div><div><span>Meta de redução no retrabalho</span><strong>'+Math.max(0,oldError-newError).toLocaleString('pt-BR',{maximumFractionDigits:1})+' p.p.</strong></div></div><p class="small-note">Metas hipotéticas. Não correspondem a produtividade ou qualidade medidas.</p>';
}

function effectiveMinutesPerEmployee(){
 const auto=$('metodoTempo').value==='volume';
 $('minutos').readOnly=auto;
 $('minutos').title=auto?'Calculado pelo volume de casos e economia por caso. Selecione modo manual para editar.':'Premissa manual editável por funcionário e dia.';
 if(auto){const total=num('vol')*num('minutosPorCaso'),p=num('pessoas');$('minutos').value=p>0?Math.round(total/p*100)/100:0;}
 return num('minutos');
}
function effectiveMinutesPerCase(employees){
 return $('metodoTempo').value==='volume'?num('minutosPorCaso'):(num('vol')>0?employees*num('minutos')/num('vol'):0);
}
function renderProcessMetrics(hours,days,employees){
 const volume=num('vol'),monthly=volume*days,perCase=effectiveMinutesPerCase(employees),daily=employees*num('minutos')/60;
 const unrealistic=employees>0&&num('minutos')>480;
 $('processMetrics').innerHTML='<div class="process-metric"><span>Volume diário</span><strong>'+volume.toLocaleString('pt-BR')+' solicitações</strong></div><div class="process-metric"><span>Volume mensal</span><strong>'+monthly.toLocaleString('pt-BR')+' solicitações</strong></div><div class="process-metric"><span>Tempo potencial liberado/dia</span><strong>'+daily.toLocaleString('pt-BR',{maximumFractionDigits:1})+' h</strong></div><div class="process-metric"><span>Economia por solicitação</span><strong>'+perCase.toLocaleString('pt-BR',{maximumFractionDigits:2})+' min</strong></div><p class="metrics-note">'+(unrealistic?'Atenção: a economia hipotética ultrapassa 8 horas por pessoa/dia; revise as premissas. ':'' )+'Os indicadores são estimativas baseadas no volume informado, não medições reais.</p>';
}
function syncTimeMode(){effectiveMinutesPerEmployee();calc()}
$('metodoTempo').addEventListener('change',syncTimeMode);
function calc(){let employees=num('pessoas'),mins=effectiveMinutesPerEmployee(),hour=num('hora'),days=num('dias'),monthly=num('mensal'),setup=num('implantacao'),extra=num('extras'),real=Math.min(100,num('realizacao'))/100,hours=employees*mins*days/60,yearBenefit=hours*hour*12*real,yearCost=monthly*12+setup+extra,net=yearBenefit-yearCost,roi=yearCost>0?100*net/yearCost:null,margin=hours*hour*real-monthly-extra/12,payback=margin>0?setup/margin:null,cash=num('economiaCaixa'),cashNet=cash-yearCost,cashROI=yearCost>0?100*cashNet/yearCost:null;$('solicitacoesMes').textContent=(num('vol')*days).toLocaleString('pt-BR');$('minutosCasoResumo').textContent=effectiveMinutesPerCase(employees).toLocaleString('pt-BR',{maximumFractionDigits:2})+' min';renderProcessMetrics(hours,days,employees);$('capacityValue').textContent=fmt(yearBenefit);$('cashValue').textContent=fmt(cash);$('cashNet').textContent=fmt(cashNet);$('horasR').textContent=hours.toLocaleString('pt-BR',{maximumFractionDigits:1})+' h';$('beneficioR').textContent=fmt(yearBenefit);$('custoR').textContent=fmt(yearCost);$('liquidoR').textContent=fmt(net);$('roiResult').textContent=roi===null?'Indefinido':roi.toLocaleString('pt-BR',{maximumFractionDigits:1})+'%';$('paybackR').textContent=payback===null?'Não atingido':payback===0?'Imediato':payback.toLocaleString('pt-BR',{maximumFractionDigits:1})+' meses';$('kvalue').textContent=fmt(hours*hour);$('kroi').textContent=roi===null?'—':roi.toLocaleString('pt-BR',{maximumFractionDigits:0})+'%';$('sensibilidade').innerHTML=[25,50,75,100].map(p=>{const r=yearCost>0?100*(hours*hour*12*p/100-yearCost)/yearCost:null;return '<div class="line"><span>'+p+'% de realização</span><strong>'+(r===null?'—':r.toLocaleString('pt-BR',{maximumFractionDigits:1})+'% de ROI')+'</strong></div>'}).join('');updateVisuals(yearBenefit,yearCost,net);if(typeof renderScenarios==='function')renderScenarios(employees,mins,hour,days,yearCost);renderPilot();const valid=validateScenario(false).ok;if(!valid){['roiResult','kroi','beneficioR','liquidoR','paybackR','capacityValue','cashNet'].forEach(id=>$(id).textContent='—');$('roiInterpretation').textContent='Existem valores inválidos. Corrija os campos para calcular um retorno confiável.';}updateDashboard();return {employees,mins,hour,days,monthly,setup,extra,real,yearBenefit,yearCost,net,roi,payback,cash,cashNet,cashROI,valid}}
['pessoas','minutos','hora','dias','mensal','implantacao','extras','realizacao','economiaCaixa','minutosPorCaso','metodoTempo','vol','pilotTempoAtual','pilotTempoMeta','pilotErroAtual','pilotErroMeta','pilotDias'].forEach(id=>$(id).addEventListener('input',()=>{calc();if($('roiValidation').textContent)validateScenario(true)}));$('reset').addEventListener('click',()=>{Object.entries({pessoas:10,minutos:15,minutosPorCaso:3.75,metodoTempo:'volume',hora:30,dias:22,mensal:600,implantacao:1800,extras:0,realizacao:100,economiaCaixa:0,pilotTempoAtual:10,pilotTempoMeta:6,pilotErroAtual:15,pilotErroMeta:7,pilotDias:20}).forEach(([k,v])=>$(k).value=v);syncTimeMode();calc()});
function recs(){const r=[[currentProcess,'Alta','Classificação e encaminhamento de solicitações com revisão humana.','Precisão da triagem; validação de exceções'],['Pesquisa de documentos','Média','Respostas apoiadas em documentos e referências, com controle de acesso.','Atualidade das fontes e permissões'],['Acompanhamento comercial','Média','Registro e lembretes de contatos pendentes.','Integração com CRM e privacidade']];$('recitems').innerHTML=r.map(x=>'<div class="card"><div style="display:flex;justify-content:space-between;gap:10px;align-items:center"><h3 style="margin:0"></h3><span class="tag">'+x[1]+' prioridade</span></div><p class="sub">'+x[2]+'</p><div class="line"><span>Risco / supervisão</span><strong>'+x[3]+'</strong></div><button class="ghost" data-go="jornada">Avaliar fluxo →</button></div>').join('');$('recitems').querySelectorAll('.card').forEach((el,i)=>{el.querySelector('h3').textContent=r[i][0]});document.querySelectorAll('#recitems [data-go]').forEach(b=>b.onclick=()=>show('jornada'))}
$('analisar').addEventListener('click',()=>{currentProcess=$('proc').value.trim()||'Processo sem título';diagnostic();recs();$('status').textContent='Aguardando decisão após diagnóstico';$('status').style.color='';show('recomendacoes')});
const stages=[['Cadastro do processo','Humano · Processos registrados'],['Diagnóstico de prontidão','Regras · Qualidade de dados, equipe e segurança'],['Recomendações de automação','IA conceitual · Relevância das sugestões'],['Simulação de custos e ROI','Cálculo determinístico · ROI e payback'],['Decisão de aprovação ou revisão','Humano · Taxa de aprovação'],['Validação da automação simulada','Humano · Testes aprovados'],['Acompanhamento de resultados','Indicadores · Tempo, custo, qualidade e adoção']];$('flow').innerHTML=stages.map((x,i)=>'<div class="flow"><strong>'+(i+1)+'. '+x[0]+'</strong><p>'+x[1]+'</p></div>'+(i<stages.length-1?'<div class="arrow">↓</div>':'')).join('');$('aprovar').onclick=()=>$('status').textContent='Simulação aprovada pelo gestor.';$('revisar').onclick=()=>$('status').textContent='Revisão solicitada; voltar às recomendações.';
const companies=[['WebGlobal / AiProtus','Robôs interativos para recepção e eventos','Logística, dados e consentimento','Pré-venda e aluguel para eventos; preço público não identificado'],['Aditum','Agentes inteligentes para testes e processos de pagamento','Adesão de equipes e prioridades','Ganhos operacionais relatados'],['Digibee','Plataforma low-code de integração empresarial','Sistemas legados, backlog e governança','TEI 2022: ROI 232% para organização composta de integração; não é ROI de IA'],['Cilia','IA em imagens de danos e orçamentos de sinistros','Precisão e revisão humana (riscos analisados pela equipe)','Preço padrão e ROI típicos não confirmados; veja pesquisa complementar'],['HugLabs','Pesquisa, busca e classificação documental','Adaptação à estrutura do cliente','Entrevista cita cerca de 6 meses de implantação; não é prazo de ROI'],['Leavo AI','Agentes para atendimento e vendas em WhatsApp/CRM','Dados, volume, integração e privacidade (riscos de análise)','Plano Personal publicado a partir de R$ 397/mês; custos extras variáveis']];$('companies').innerHTML=companies.map(c=>'<article class="card company"><h3 style="margin-top:0"></h3><p class="sub"><b>Aplicação:</b> '+c[1]+'</p><p class="sub"><b>Desafios:</b> '+c[2]+'</p><p class="sub"><b>Economia:</b> '+c[3]+'</p></article>').join('');$('companies').querySelectorAll('h3').forEach((e,i)=>e.textContent=companies[i][0]);
$('exportar').onclick=()=>{const r=calc(),text='IMPULSO AI — CENÁRIO ACADÊMICO\nFuncionários: '+r.employees+'\nMinutos/dia: '+r.mins+'\nCusto/hora: '+fmt(r.hour)+'\nInvestimento anual: '+fmt(r.yearCost)+'\nBenefício econômico anual: '+fmt(r.yearBenefit)+'\nROI potencial: '+(r.roi===null?'Indefinido':r.roi.toFixed(1)+'%')+'\nValores hipotéticos; sem validação empírica.\n';const b=new Blob([text],{type:'text/plain;charset=utf-8'}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download='impulso-ai-roi.txt';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)};recs();

const context=()=>({name:($('empresaNome').value||'Empresa sem nome').trim().slice(0,80),sector:$('empresaSetor').value,size:$('empresaPorte').value,goal:$('empresaObjetivo').value,process:($('proc').value||'Processo sem nome').trim().slice(0,100),description:($('desc').value||'').trim().slice(0,900),volume:num('vol')});
const safe=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let blocked=false,selectedOpportunity='Atendimento e triagem';
const options=[{name:'Atendimento e triagem',complexity:'Média',gain:'Agilidade operacional',risk:'Revisão humana para mensagens sensíveis'},{name:'Documentos e conhecimento',complexity:'Média',gain:'Busca de informações',risk:'Controle de acesso e atualização das fontes'},{name:'Vendas e CRM',complexity:'Alta',gain:'Acompanhamento comercial',risk:'Integrações, LGPD e qualidade dos contatos'}];
let diagnosisDone=false,opportunityChosen=false,simulationReviewed=false,approvalState='none',reportVisited=false;
const workflowStages=[['Diagnóstico','diagnostico'],['Oportunidade','recomendacoes'],['ROI','roi'],['Decisão','jornada'],['Relatório','relatorio']];
function updateWorkflow(){
 const completed=[diagnosisDone,opportunityChosen,simulationReviewed,approvalState==='approved',reportVisited];
 const done=completed.filter(Boolean).length;
 const next=completed.findIndex(v=>!v);
 const destination=next===-1?'relatorio':workflowStages[next][1];
 const labels=['Descreva a operação e faça o diagnóstico.','Selecione uma oportunidade para avaliar.','Ajuste os números do seu cenário de retorno.','Submeta a simulação à aprovação humana.','Revise e imprima o relatório executivo.'];
 $('workflowSteps').innerHTML=workflowStages.map(([name,id],i)=>'<button class="workflow-step '+(completed[i]?'done':i===next?'current':'')+'" type="button" data-workflow="'+id+'" aria-label="Abrir '+safe(name)+'"><span class="workflow-step-num">'+(completed[i]?'✓':i+1)+'</span><span>'+safe(name)+'</span></button>').join('');
 $('workflowSteps').querySelectorAll('[data-workflow]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.workflow)));
 $('workflowBadge').textContent=done+'/5 etapas';
 $('workflowHint').textContent=next===-1?'Cenário conceitual concluído. Revise a análise antes de apresentar.':labels[next];
 $('workflowNext').textContent=next===-1?'Ver relatório →':'Continuar: '+workflowStages[next][0]+' →';
 $('workflowNext').onclick=()=>show(destination);
 $('workflowLastAction').textContent=approvalState==='approved'?'Aprovação simulada registrada; a implementação real não foi autorizada.':approvalState==='review'?'Revisão solicitada; nenhuma implementação foi autorizada.':diagnosisDone?'Diagnóstico preparado; decisões e métricas são apenas demonstrativas.':'Nenhum processo real foi implementado.';
 updateDashboard();
}
function invalidateDecision(){approvalState='none';reportVisited=false;$('status').textContent='Dados alterados: é necessária uma nova aprovação.';$('status').style.color='';updateWorkflow();}
function showContext(){const c=context();currentProcess=c.process;$('profileLabel').textContent=c.name+' · '+c.sector;$('profileSubtitle').textContent=c.size+' · objetivo: '+c.goal+' · '+c.process;$('dashboardContext').textContent='Empresa: '+c.name+' · '+c.size+' · '+c.sector;$('dashboardOpportunity').textContent='Oportunidade em análise: '+selectedOpportunity;$('dashboardProcess').textContent=c.process;$('kprocess').textContent='1';$('recommendationContext').textContent='Contexto: '+c.sector+' · '+c.goal+'. As alternativas abaixo são hipóteses de automação, não recomendações produzidas por IA real.';$('scenarioContext').textContent='Simulando o processo “'+c.process+'” para '+c.name+'. Os valores financeiros são premissas editáveis, não custos observados.';recs();renderCompare();updateWorkflow()}
['empresaNome','empresaSetor','empresaPorte','empresaObjetivo'].forEach(id=>$(id).addEventListener('input',()=>{showContext();diagnosisDone=false;opportunityChosen=false;simulationReviewed=false;invalidateDecision()}));showContext();
function selectOption(name){if(!diagnosisDone){$('decisionNote').textContent='Complete o diagnóstico antes de selecionar uma oportunidade.';show('diagnostico');return}selectedOpportunity=name;opportunityChosen=true;simulationReviewed=false;approvalState='none';reportVisited=false;renderCompare();showContext();$('status').textContent='Aguardando decisão para a oportunidade selecionada';$('status').style.color='';$('decisionNote').textContent='Oportunidade selecionada: '+name+'. A aprovação requer diagnóstico sem bloqueios.';updateWorkflow()}
function renderCompare(){
 const goal=$('empresaObjetivo').value,sector=$('empresaSetor').value;
 const preference={
  'Reduzir tempo de tarefas':[3,3,2],
  'Melhorar atendimento':[3,1,2],
  'Organizar dados e documentos':[1,3,1],
  'Aumentar conversão comercial':[2,1,3]
 };
 const reasons={
  'Atendimento e triagem':'Ajuda a classificar solicitações e direcionar casos repetitivos para a equipe adequada.',
  'Documentos e conhecimento':'Organiza acesso a políticas e informações, mantendo controle das fontes e responsáveis.',
  'Vendas e CRM':'Apoia o acompanhamento de contatos, próximos passos e oportunidades comerciais.'
 };
 const weight=preference[goal]||[2,2,2];
 const ranked=options.map((o,i)=>({...o,fit:weight[i]})).sort((a,b)=>b.fit-a.fit);
 $('opportunityCompare').innerHTML='';
 ranked.forEach((o,i)=>{
  const el=document.createElement('article');el.className='reco-choice'+(selectedOpportunity===o.name?' selected':'');
  const suitability=o.fit===3?'Mais alinhada ao objetivo':o.fit===2?'Pode ser útil':'Avaliar necessidade';
  el.innerHTML='<div class="reco-header"><span class="reco-rank">0'+(i+1)+'</span><span class="pill">'+suitability+'</span></div><h3>'+safe(o.name)+'</h3><p class="sub">'+safe(reasons[o.name])+'</p><div class="reco-detail"><span>Complexidade: '+safe(o.complexity)+'</span><span>Supervisão: '+safe(o.risk)+'</span></div><p class="small-note">Relação sugerida com '+safe(goal.toLowerCase())+' no setor de '+safe(sector.toLowerCase())+'. Classificação didática baseada em regras, não em IA treinada.</p>';
  const button=document.createElement('button');button.className=selectedOpportunity===o.name?'primary':'ghost';button.textContent=selectedOpportunity===o.name?'Oportunidade selecionada ✓':'Selecionar para análise';button.addEventListener('click',()=>selectOption(o.name));el.appendChild(button);$('opportunityCompare').appendChild(el);
 });
}

function diagnostic(){const d=['dados','equipe','integracao','seguranca'],sum=d.reduce((a,k)=>a+Number($(k).value),0);const score=Math.round(sum*1.25);const security=Number($('seguranca').value),data=Number($('dados').value);blocked=security===0||data===0;const reasons=[];if(data===0)reasons.push('Dados insuficientes: organizar, validar e documentar fontes antes de testar.');if(security===0)reasons.push('Segurança sem controles: estabelecer acesso, privacidade e supervisão antes de avançar.');$('score').textContent=score;$('progress').style.width=score+'%';$('nivel').textContent=blocked?'Não apto para implantação':score>=80?'Boa prontidão para piloto controlado':score>=50?'Preparação intermediária':'Preparação inicial';$('guardAlert').className='guard-alert'+(!blocked?' good':'');$('guardAlert').innerHTML='<b>'+(blocked?'BLOQUEIO DE SEGURANÇA / DADOS':'PROSSEGUIR COM SUPERVISÃO')+'</b><div>'+safe(blocked?reasons.join(' '):'Há condições ilustrativas para planejar um teste controlado, sujeito à aprovação de gestor e revisão técnica.')+'</div>';$('feedback').textContent=blocked?'A pontuação geral não substitui os controles mínimos. A aprovação será bloqueada nesta simulação.':score>=80?'Prontidão favorável para testar a proposta com amostras e responsáveis.':'Priorize os ajustes do plano de ação antes de ampliar o escopo.';updateReadiness();let items=[['Dados','dados','Padronizar registros e verificar sua qualidade.'],['Capacitação','equipe','Treinar os profissionais e definir responsáveis.'],['Integração','integracao','Documentar sistemas, APIs e testes de conectividade.'],['Segurança','seguranca','Definir permissões, LGPD, supervisão e tratamento de incidentes.']];$('actionPlan').innerHTML=items.map(([title,id,advice])=>'<div class="action-item '+(Number($(id).value)===0?'warn':'')+'"><b>'+safe(title)+' · '+(Number($(id).value)===20?'Preparado':Number($(id).value)===10?'Aprimorar':'Prioridade crítica')+'</b>'+safe(advice)+'</div>').join('');showContext();return score}
function renderScenarios(employees,mins,hour,days,cost){const base=employees*mins*days/60*hour*12;const specs=[['Conservador',25],['Moderado',50],['Otimista',100]];$('threeScenarios').innerHTML=specs.map(([name,p])=>{const benefit=base*p/100,net=benefit-cost,roi=cost>0?(net/cost*100):null;return '<div class="scenario-card '+(net<0?'negative':'positive')+'"><b>'+name+' · '+p+'%</b><strong>'+(roi===null?'—':roi.toLocaleString('pt-BR',{maximumFractionDigits:1})+'%')+'</strong><span>ROI potencial</span><div class="line"><span>Valor</span><b>'+fmt(benefit)+'</b></div><div class="line"><span>Saldo</span><b>'+fmt(net)+'</b></div></div>'}).join('')}
function reportData(){const c=context(),r=calc(),score=diagnostic();const risks=options.find(o=>o.name===selectedOpportunity)?.risk||'Revisão humana';return{c,r,score,risks}}

function buildReport(){
 const {c,r,score,risks}=reportData();
 const roi=r.roi===null?'Indefinido':r.roi.toLocaleString('pt-BR',{maximumFractionDigits:1})+'%';
 const monthlyCases=c.volume*r.days,monthlyHours=r.employees*r.mins*r.days/60;
 const savedCase=effectiveMinutesPerCase(r.employees);
 const decision=approvalState==='approved'?'Aprovada para demonstração':approvalState==='review'?'Revisão solicitada':'Aguardando aprovação';
 const generatedAt=new Date().toLocaleString('pt-BR');const valid=validateScenario(false).ok;
 const max=Math.max(1,r.yearBenefit,r.yearCost,Math.max(0,r.net));
 const comparison=[['Benefício potencial',r.yearBenefit,'benefit'],['Investimento estimado',r.yearCost,'cost'],['Saldo potencial',Math.max(0,r.net),'balance']];
 const bars=comparison.map(([name,v,cls])=>'<div class="report-bar-line"><span>'+safe(name)+'</span><div class="report-bar-track"><div class="report-bar-fill '+cls+'" style="width:'+(v/max*100).toFixed(1)+'%"></div></div><b>'+fmt(v)+'</b></div>').join('');
 const kpis=[['Prontidão',score+'/100'],['ROI potencial',roi],['Solicitações/mês',monthlyCases.toLocaleString('pt-BR')],['Horas liberadas/mês',monthlyHours.toLocaleString('pt-BR',{maximumFractionDigits:1})+' h']];
 const kpiHTML=kpis.map(([label,value])=>'<div class="report-kpi"><span>'+label+'</span><strong>'+safe(value)+'</strong></div>').join('');
 const dimensions=[['Dados','dados'],['Equipe','equipe'],['Integração','integracao'],['Segurança','seguranca']];
 const dimTable=dimensions.map(([label,id])=>'<tr><td>'+safe(label)+'</td><td>'+safe($(id).selectedOptions[0].text)+'</td><td>'+Number($(id).value)*5+'%</td></tr>').join('');
 const actions=dimensions.filter(([name,id])=>Number($(id).value)<20).map(([name,id])=>'<li><b>'+safe(name)+':</b> '+safe(({dados:'Padronizar os registros e verificar qualidade dos dados.',equipe:'Treinar colaboradores e designar responsáveis.',integracao:'Validar os sistemas e conectores necessários.',seguranca:'Definir controles de acesso, consentimento e tratamento de incidentes.'})[id])+'</li>').join('');
 const actionContent=actions||'<li>Manter monitoramento e revisão humana durante o piloto.</li>';
 const html='<div class="report-document"><div class="report-cover"><div class="report-brand">IMPULSO <span>AI</span> / FMU · 2026</div><h1>Relatório executivo</h1><p>Diagnóstico, oportunidades e viabilidade econômica · cenário demonstrativo</p><div class="report-company">'+safe(c.name)+' · '+safe(c.sector)+' · '+safe(c.size)+'</div><p class="report-generated-at">Emitido em '+safe(generatedAt)+' · Simulação acadêmica</p></div><div class="report-body">'+(valid?'':'<div class="report-warning"><b>CENÁRIO NÃO VALIDADO:</b> corrija as premissas e metas inconsistentes antes de utilizar os valores de retorno.</div>')+'<div class="report-kpi-grid">'+kpiHTML+'</div>'+
 '<h2>01 · Contexto operacional</h2><p><b>Objetivo:</b> '+safe(c.goal)+'. <b>Processo:</b> '+safe(c.process)+'.</p><p>'+safe(c.description||'Descrição não informada')+'</p><p><b>Volume:</b> '+c.volume.toLocaleString('pt-BR')+' solicitações/dia × '+r.days+' dias úteis = '+monthlyCases.toLocaleString('pt-BR')+' solicitações/mês. <b>Economia por solicitação:</b> '+savedCase.toLocaleString('pt-BR',{maximumFractionDigits:2})+' minutos (premissa editável).</p>'+
 '<h2>02 · Prontidão e riscos</h2><p><b>Índice acadêmico:</b> '+score+'/100 · <b>Status:</b> '+(blocked?'Bloqueado por insuficiência de dados ou segurança':'Elegível somente para piloto sujeito a revisão')+'.</p><table><thead><tr><th>Dimensão</th><th>Condição declarada</th><th>Pontuação</th></tr></thead><tbody>'+dimTable+'</tbody></table><h3>Plano de ação prioritário</h3><ul>'+actionContent+'</ul>'+
 '<h2>03 · Oportunidade selecionada</h2><p><b>'+safe(selectedOpportunity)+'</b> — '+safe(risks)+'. A priorização é feita por regras transparentes, sem API de IA conectada.</p>'+
 '<h2>04 · Comparação de custos e benefícios</h2><div class="report-chart"><div class="report-chart-title">Cenário econômico anual — 12 meses</div>'+bars+'</div><table><tbody><tr><td>Capacidade liberada/mês</td><td>'+monthlyHours.toLocaleString('pt-BR',{maximumFractionDigits:1})+' horas</td></tr><tr><td>Taxa de aproveitamento econômico</td><td>'+(r.real*100).toLocaleString('pt-BR',{maximumFractionDigits:1})+'%</td></tr><tr><td>Benefício anual potencial</td><td>'+fmt(r.yearBenefit)+'</td></tr><tr><td>Custo total no primeiro ano</td><td>'+fmt(r.yearCost)+'</td></tr><tr><td>Saldo potencial anual</td><td>'+fmt(r.net)+'</td></tr><tr><td>ROI econômico potencial</td><td>'+roi+'</td></tr><tr><td>Payback estimado nas premissas</td><td>'+(r.payback===null?'Não atingido':r.payback.toLocaleString('pt-BR',{maximumFractionDigits:1})+' meses')+'</td></tr></tbody></table>'+
 '<h2>05 · Economia financeira e aproveitamento de capacidade</h2><p>O valor econômico das horas liberadas não comprova redução de gastos em caixa. A economia informada em caixa é analisada separadamente, sem soma automática que poderia duplicar benefícios.</p><table><tbody><tr><td>Capacidade potencial aproveitada / ano</td><td>'+fmt(r.yearBenefit)+'</td></tr><tr><td>Economia em caixa informada / ano</td><td>'+fmt(r.cash)+'</td></tr><tr><td>Custo anual total</td><td>'+fmt(r.yearCost)+'</td></tr><tr><td>Saldo anual de caixa, sem horas</td><td>'+fmt(r.cashNet)+'</td></tr><tr><td>ROI financeiro apenas de caixa</td><td>'+(r.cashROI===null?'Indefinido':r.cashROI.toLocaleString('pt-BR',{maximumFractionDigits:1})+'%')+'</td></tr></tbody></table>'+
 '<h2>06 · Indicadores de validação em piloto</h2><p>Metas propostas para '+num('pilotDias')+' dias úteis e '+(c.volume*num('pilotDias')).toLocaleString('pt-BR')+' solicitações. Não são resultados observados.</p><table><thead><tr><th>Indicador</th><th>Referência declarada</th><th>Meta hipotética</th></tr></thead><tbody><tr><td>Tempo médio por solicitação</td><td>'+num('pilotTempoAtual').toLocaleString('pt-BR')+' min</td><td>'+num('pilotTempoMeta').toLocaleString('pt-BR')+' min</td></tr><tr><td>Taxa de retrabalho</td><td>'+num('pilotErroAtual').toLocaleString('pt-BR')+'%</td><td>'+num('pilotErroMeta').toLocaleString('pt-BR')+'%</td></tr><tr><td>Horas que se espera liberar</td><td>Sem medição real</td><td>'+Math.max(0,(num('pilotTempoAtual')-num('pilotTempoMeta'))*c.volume*num('pilotDias')/60).toLocaleString('pt-BR',{maximumFractionDigits:1})+' h</td></tr></tbody></table>'+
 '<h2>07 · Governança e próximos passos</h2><p><b>Decisão simulada do gestor:</b> '+decision+'. A aprovação não executa alterações em sistemas externos.</p><ol><li>Validar dados de origem e responsáveis pelo processo.</li><li>Preparar piloto controlado com critérios de qualidade e segurança.</li><li>Comparar tempos e custos medidos antes e depois do piloto.</li><li>Revisar o investimento com dados reais e registrar a decisão humana.</li></ol>'+
 '<div class="report-warning"><b>Limites deste relatório:</b> estimativas acadêmicas com dados fictícios ou informados pelo usuário. Tempo liberado não é economia em caixa nem lucro. Sem IA generativa real, integrações ou validação comercial. A pontuação não constitui certificação.</div><p class="report-credits"><b>Grupo FMU:</b> Beatriz Ramos — RA 2025116740 · Nicole Santos Damaceno — RA 2025102325 · Victoria Maria de Carvalho Franca — RA 2025102342 · Kauã da Silva Viturino — RA 2025102893.</p></div></div>';
 $('reportPreview').innerHTML=html;$('reportPrint').innerHTML=html;
 return html;
}
$('printReport').onclick=()=>{buildReport();window.print()};
$('downloadReport').onclick=()=>{const c=buildReport();let stylesheet='';try{stylesheet=Array.from(document.styleSheets).filter(sheet=>sheet.href&&sheet.href.includes('style.css')).map(sheet=>Array.from(sheet.cssRules).map(rule=>rule.cssText).join('\n')).join('\n')}catch(e){stylesheet='body{font-family:Arial,sans-serif}.report-cover{background:#1b3770;color:white;padding:30px}.report-body{padding:30px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ddd;padding:7px}'}const html='<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Relatório IMPULSO AI</title><style>'+stylesheet+'</style><body style="background:#fff"><div style="max-width:950px;margin:auto">'+c+'</div></body></html>';const blob=new Blob([html],{type:'text/html;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='impulso-ai-relatorio.html';a.click();setTimeout(()=>URL.revokeObjectURL(url),1500)};
const originalApprove=$('aprovar').onclick;$('aprovar').onclick=()=>{diagnostic();if(blocked){$('status').textContent='Aprovação bloqueada: resolver primeiro segurança e qualidade de dados.';$('status').style.color='#aa6022'}else if(!diagnosisDone||!opportunityChosen||!simulationReviewed){$('status').textContent='Antes de aprovar, conclua o diagnóstico, selecione uma oportunidade e revise pelo menos uma premissa do ROI.';$('status').style.color='#aa6022'}else{originalApprove();$('status').style.color='#198360'}};
$('revisar').addEventListener('click',()=>{$('decisionNote').textContent='Revise as premissas do diagnóstico e avalie novamente.'});
renderCompare();diagnostic();calc();buildReport();updateWorkflow();
$('analisar').addEventListener('click',()=>{diagnosisDone=true;opportunityChosen=false;simulationReviewed=false;approvalState='none';reportVisited=false;updateWorkflow()});
$('pessoas').addEventListener('input',()=>{simulationReviewed=true;invalidateDecision()});
['minutos','minutosPorCaso','metodoTempo','hora','dias','mensal','implantacao','extras','realizacao'].forEach(id=>$(id).addEventListener('input',()=>{simulationReviewed=true;invalidateDecision()}));
$('reset').addEventListener('click',()=>{simulationReviewed=false;invalidateDecision()});
$('aprovar').addEventListener('click',()=>{diagnostic();approvalState=blocked||!diagnosisDone||!opportunityChosen||!simulationReviewed?'none':'approved';updateWorkflow()});
$('revisar').addEventListener('click',()=>{approvalState='review';updateWorkflow()});
$('printReport').addEventListener('click',()=>{reportVisited=true;updateWorkflow()});
$('downloadReport').addEventListener('click',()=>{reportVisited=true;updateWorkflow()});

['dados','equipe','integracao','seguranca'].forEach(id=>$(id).addEventListener('change',()=>{diagnostic();diagnosisDone=false;opportunityChosen=false;simulationReviewed=false;invalidateDecision()}));
['proc','desc','vol'].forEach(id=>$(id).addEventListener('input',()=>{showContext();diagnosisDone=false;opportunityChosen=false;simulationReviewed=false;invalidateDecision()}));

const draftKey='impulso-ai-fmu-draft-v1';
const draftIds=['empresaNome','empresaSetor','empresaPorte','empresaObjetivo','proc','desc','vol','dados','equipe','integracao','seguranca','pessoas','minutos','minutosPorCaso','metodoTempo','hora','dias','mensal','implantacao','extras','realizacao','economiaCaixa','pilotTempoAtual','pilotTempoMeta','pilotErroAtual','pilotErroMeta','pilotDias'];
function draftMessage(message){$('draftMessage').textContent=message}
$('saveDraft').addEventListener('click',()=>{
 try{
  const values=Object.fromEntries(draftIds.map(id=>[id,$(id).value]));
  localStorage.setItem(draftKey,JSON.stringify({version:1,values,selectedOpportunity}));
  draftMessage('Rascunho salvo somente neste navegador. Não é enviado para nenhum servidor.');
 }catch(e){draftMessage('Não foi possível salvar neste navegador. Verifique se o armazenamento local está permitido.')}
});
$('loadDraft').addEventListener('click',()=>{
 try{
  const item=localStorage.getItem(draftKey);
  if(!item){draftMessage('Nenhum rascunho encontrado neste navegador.');return}
  const draft=JSON.parse(item);
  if(draft.version!==1||!draft.values||typeof draft.values!=='object')throw Error('Versão incompatível');
  draftIds.forEach(id=>{
   const value=draft.values[id];
   if(typeof value!=='string')return;
   const el=$(id);
   if(el.tagName==='SELECT'){
    if([...el.options].some(opt=>opt.value===value))el.value=value;
   }else if(el.type==='number'){
    if(value!==''&&Number.isFinite(Number(value))&&Number(value)>=0)el.value=value;
   }else el.value=value.slice(0,el.maxLength>0?el.maxLength:900);
  });
  selectedOpportunity=options.some(o=>o.name===draft.selectedOpportunity)?draft.selectedOpportunity:options[0].name;
  diagnosisDone=false;opportunityChosen=false;simulationReviewed=false;approvalState='none';reportVisited=false;
  syncTimeMode();diagnostic();calc();showContext();renderCompare();buildReport();updateWorkflow();
  $('status').textContent='Rascunho recuperado: faça novo diagnóstico antes de aprovar.';
  draftMessage('Rascunho recuperado. Por segurança, decisões e aprovações anteriores não são restauradas.');
 }catch(e){draftMessage('Não foi possível recuperar os dados. O rascunho pode estar inválido.')}
});
$('clearDraft').addEventListener('click',()=>{
 try{localStorage.removeItem(draftKey);draftMessage('Rascunho local apagado. Os campos atuais permanecem até você recarregar ou modificar a página.')}
 catch(e){draftMessage('Não foi possível apagar os dados locais.')}
});


/* Scenario templates and local history, no external storage */
const businessTemplates={
 comercio:{empresaNome:'Loja Aurora — exemplo',empresaSetor:'Comércio',empresaPorte:'Microempresa',empresaObjetivo:'Melhorar atendimento',proc:'Triagem de pedidos e dúvidas',desc:'A equipe confere dúvidas de entrega, trocas e pedidos e encaminha cada solicitação.',vol:'65',dados:'10',equipe:'10',integracao:'10',seguranca:'20',pessoas:'5',minutosPorCaso:'2.5',metodoTempo:'volume',hora:'26',dias:'22',mensal:'450',implantacao:'1200',extras:'600',realizacao:'50'},
 servicos:{empresaNome:'Consultoria Horizonte — exemplo',empresaSetor:'Serviços',empresaPorte:'Pequena empresa',empresaObjetivo:'Organizar dados e documentos',proc:'Pesquisa de contratos e documentos',desc:'A equipe precisa localizar informações em contratos e documentos internos antes de responder demandas.',vol:'30',dados:'20',equipe:'10',integracao:'10',seguranca:'20',pessoas:'6',minutosPorCaso:'4',metodoTempo:'volume',hora:'38',dias:'22',mensal:'650',implantacao:'2200',extras:'1000',realizacao:'50'},
 industria:{empresaNome:'Fábrica Atlas — exemplo',empresaSetor:'Indústria',empresaPorte:'Média empresa',empresaObjetivo:'Reduzir tempo de tarefas',proc:'Registro e conferência de ordens de produção',desc:'Registros e informações das ordens são conferidos manualmente antes de atualizar sistemas internos.',vol:'55',dados:'10',equipe:'20',integracao:'10',seguranca:'20',pessoas:'8',minutosPorCaso:'6',metodoTempo:'volume',hora:'34',dias:'22',mensal:'900',implantacao:'3500',extras:'1500',realizacao:'50'}
};
const scenarioInputs=['empresaNome','empresaSetor','empresaPorte','empresaObjetivo','proc','desc','vol','dados','equipe','integracao','seguranca','pessoas','minutos','minutosPorCaso','metodoTempo','hora','dias','mensal','implantacao','extras','realizacao','economiaCaixa','pilotTempoAtual','pilotTempoMeta','pilotErroAtual','pilotErroMeta','pilotDias'];
function invalidateWorkflowAll(){
 diagnosisDone=false;opportunityChosen=false;simulationReviewed=false;approvalState='none';reportVisited=false;
 selectedOpportunity=options[0].name;
 $('status').textContent='Cenário alterado: realize o diagnóstico antes de aprovar.';
 updateWorkflow();
}
function setScenarioFields(values){
 scenarioInputs.forEach(id=>{
  const val=values[id];if(val===undefined||val===null)return;
  const el=$(id),v=String(val);
  if(el.tagName==='SELECT'){if([...el.options].some(opt=>opt.value===v))el.value=v}
  else if(el.type==='number'){if(v!==''&&Number.isFinite(Number(v))&&Number(v)>=0)el.value=v}
  else el.value=v.slice(0,el.maxLength>0?el.maxLength:900);
 });
 syncTimeMode();diagnostic();showContext();calc();buildReport();
}
document.querySelectorAll('[data-template]').forEach(button=>button.addEventListener('click',()=>{
 const template=businessTemplates[button.dataset.template];if(!template)return;
 setScenarioFields(template);invalidateWorkflowAll();
 $('templateMessage').textContent='Cenário fictício de '+$('empresaSetor').value.toLowerCase()+' carregado. Personalize os campos e clique em Analisar prontidão.';
 show('diagnostico');
}));
const historyKey='impulso-ai-fmu-history-v1';
function readHistory(){
 try{const arr=JSON.parse(localStorage.getItem(historyKey)||'[]');return Array.isArray(arr)?arr.filter(h=>h&&h.id&&h.fields&&h.metrics).slice(0,12):[]}
 catch(e){return []}
}
function writeHistory(items){
 try{localStorage.setItem(historyKey,JSON.stringify(items.slice(0,12)));return true}catch(e){$('saveAnalysisStatus').textContent='Armazenamento indisponível neste navegador.';return false}
}
const numberLabel=(value,suffix='')=>(Number.isFinite(value)?Number(value).toLocaleString('pt-BR',{maximumFractionDigits:1}):'—')+suffix;
function historyLabel(h){return (h.label||h.fields.empresaNome)+' · '+h.fields.proc}
function renderHistory(){
 const arr=readHistory(),list=$('historyList'),a=$('compareA'),b=$('compareB'),query=$('historySearch').value.trim().toLocaleLowerCase('pt-BR'),visible=arr.filter(h=>[h.label||'',h.fields.empresaNome||'',h.fields.proc||''].join(' ').toLocaleLowerCase('pt-BR').includes(query));
 if(!visible.length){list.innerHTML='<p class="history-empty">'+(arr.length?'Nenhuma análise corresponde à pesquisa.':'Nenhuma análise salva. Complete um diagnóstico, selecione uma oportunidade e salve seu cenário na tela de ROI.')+'</p>'}
 else{
  list.innerHTML=visible.map(h=>'<div class="history-row"><div><b>'+safe(historyLabel(h))+'</b><small>'+safe(h.date||'')+' · Prontidão '+numberLabel(Number(h.metrics.score))+'/100 · ROI '+numberLabel(Number(h.metrics.roi),'%')+'</small></div><div class="history-row-actions"><button type="button" class="ghost" data-rename="'+safe(h.id)+'">Renomear</button><button type="button" class="ghost" data-restore="'+safe(h.id)+'">Recuperar</button><button type="button" class="ghost" data-delete="'+safe(h.id)+'">Excluir</button></div></div>').join('');
  list.querySelectorAll('[data-restore]').forEach(btn=>btn.addEventListener('click',()=>restoreHistory(btn.dataset.restore)));
  list.querySelectorAll('[data-rename]').forEach(btn=>btn.addEventListener('click',()=>{const arr=readHistory(),item=arr.find(h=>h.id===btn.dataset.rename);if(!item)return;const name=window.prompt('Nome deste cenário (até 70 caracteres):',item.label||item.fields.empresaNome);if(name===null)return;const trimmed=name.trim().slice(0,70);if(!trimmed){$('historyFeedback').textContent='Informe um nome para o cenário.';return}item.label=trimmed;if(writeHistory(arr)){renderHistory();$('historyFeedback').textContent='Cenário renomeado.'}}));
  list.querySelectorAll('[data-delete]').forEach(btn=>btn.addEventListener('click',()=>{writeHistory(readHistory().filter(h=>h.id!==btn.dataset.delete));renderHistory()}));
 }
 const prevA=a.value,prevB=b.value;
 const opts=arr.map(h=>'<option value="'+safe(h.id)+'">'+safe(h.label||h.fields.empresaNome)+' — '+safe(h.date||'')+'</option>').join('');
 a.innerHTML='<option value="">Selecione A</option>'+opts;b.innerHTML='<option value="">Selecione B</option>'+opts;
 if(arr.some(h=>h.id===prevA))a.value=prevA;
 if(arr.some(h=>h.id===prevB))b.value=prevB;
 if(!a.value&&arr[1])a.value=arr[1].id;
 if(!b.value&&arr[0])b.value=arr[0].id;
 if(a.value&&b.value&&a.value===b.value){const alternative=arr.find(h=>h.id!==b.value);if(alternative)a.value=alternative.id}
 renderHistoryComparison();
}
function restoreHistory(id){
 const h=readHistory().find(v=>v.id===id);if(!h)return;
 setScenarioFields(h.fields);
 selectedOpportunity=options.some(o=>o.name===h.selectedOpportunity)?h.selectedOpportunity:options[0].name;
 invalidateWorkflowAll();renderCompare();showContext();calc();buildReport();
 $('draftMessage').textContent='Análise recuperada do histórico. Revise e aprove novamente; nenhuma aprovação anterior foi restaurada.';
 show('diagnostico');
}
function renderHistoryComparison(){
 const arr=readHistory(),a=arr.find(h=>h.id===$('compareA').value),b=arr.find(h=>h.id===$('compareB').value),dest=$('compareResults');
 if(!a||!b){dest.innerHTML='<p class="small-note">Salve pelo menos duas análises para comparar os resultados.</p>';return}
 if(a.id===b.id){dest.innerHTML='<p class="small-note">Escolha dois registros diferentes para realizar a comparação.</p>';return}
 const indicators=[['Prontidão','score','/100',false],['Horas mensais','hours',' h',false],['Benefício anual','benefit','',true],['Custo anual','cost','',true],['ROI econômico','roi','%',false]];
 const format=(v,money,suffix)=>v===null||!Number.isFinite(Number(v))?'—':money?fmt(v):numberLabel(Number(v),suffix);
 dest.innerHTML='<div class="history-comparison"><div class="compare-heading"><span>Indicador</span><span>Anterior (A)</span><span>Atual (B)</span><span>Variação</span></div>'+indicators.map(([name,key,suffix,money])=>{
  const v1=a.metrics[key],v2=b.metrics[key],delta=v1===null||v2===null?null:v2-v1;
  return '<div class="compare-line"><span>'+name+'</span><strong>'+format(v1,money,suffix)+'</strong><strong>'+format(v2,money,suffix)+'</strong><strong class="'+(delta===null?'':delta>=0?'delta-pos':'delta-neg')+'">'+(delta!==null&&delta>0?'+':'')+format(delta,money,suffix)+'</strong></div>'
 }).join('')+'</div><p class="small-note">Comparação de hipóteses. Aumento de ROI não comprova ganho empresarial real; observe a mudança das premissas e dos riscos.</p>';
}
$('saveAnalysis').addEventListener('click',()=>{
 if(!diagnosisDone||!opportunityChosen){$('saveAnalysisStatus').textContent='Conclua o diagnóstico e selecione uma oportunidade antes de salvar.';return}
 const r=calc(),score=diagnostic(),fields=Object.fromEntries(scenarioInputs.map(id=>[id,$(id).value]));
 const entry={id:String(Date.now())+'-'+Math.random().toString(36).slice(2,7),date:new Date().toLocaleString('pt-BR'),fields,selectedOpportunity,metrics:{score,hours:r.employees*r.mins*r.days/60,benefit:r.yearBenefit,cost:r.yearCost,roi:r.roi,blocked}};
 const arr=[entry,...readHistory()].slice(0,12);
 if(writeHistory(arr)){$('saveAnalysisStatus').textContent='Análise salva apenas neste navegador. Compare na aba Histórico.';renderHistory()}
});

$('historySearch').addEventListener('input',renderHistory);
$('exportHistory').addEventListener('click',()=>{
 const records=readHistory();
 if(!records.length){$('historyFeedback').textContent='Salve ao menos uma análise para exportar.';return}
 const payload={format:'IMPULSO_AI_HISTORY',version:1,exportedAt:new Date().toISOString(),records};
 const data=new Blob([JSON.stringify(payload,null,2)],{type:'application/json;charset=utf-8'});
 const url=URL.createObjectURL(data),anchor=document.createElement('a');anchor.href=url;anchor.download='impulso-ai-historico.json';anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 $('historyFeedback').textContent='Histórico exportado em JSON. Evite compartilhar dados pessoais ou confidenciais.';
});
$('importHistory').addEventListener('click',()=>$('importHistoryFile').click());
$('importHistoryFile').addEventListener('change',async()=>{
 const file=$('importHistoryFile').files?.[0];$('importHistoryFile').value='';
 if(!file)return;
 if(file.size>1000000){$('historyFeedback').textContent='Arquivo excede 1 MB. Importe um histórico menor.';return}
 try{
  const parsed=JSON.parse(await file.text());
  if(parsed?.format!=='IMPULSO_AI_HISTORY'||parsed.version!==1||!Array.isArray(parsed.records))throw Error('Formato inválido');
  if(parsed.records.length>100)throw Error('Histórico muito grande');
  const cleaned=parsed.records.map((entry,index)=>{
   if(!entry||typeof entry!=='object'||!entry.fields||typeof entry.fields!=='object'||!entry.metrics||typeof entry.metrics!=='object')throw Error('Registro incompleto');
   const fields={};
   scenarioInputs.forEach(id=>{
    const v=entry.fields[id];if(v===undefined||v===null)return;
    if(typeof v!=='string'||v.length>1000)throw Error('Campo inválido');
    if(formLimits[id]&&(v===''||!Number.isFinite(Number(v))||Number(v)<formLimits[id][0]||Number(v)>formLimits[id][1]))throw Error('Limites inválidos');
    fields[id]=v;
   });
   if(!fields.empresaNome||!fields.proc||!fields.vol||!fields.pessoas)throw Error('Dados obrigatórios ausentes');
   const metrics={};
   ['score','hours','benefit','cost','roi'].forEach(k=>{
    const v=entry.metrics[k];if(v!==null&&v!==undefined&&(!Number.isFinite(Number(v))||Math.abs(Number(v))>10000000000))throw Error('Indicadores inválidos');
    metrics[k]=v===null||v===undefined?null:Number(v);
   });
   metrics.blocked=Boolean(entry.metrics.blocked);
   return {id:'import-'+Date.now()+'-'+index+'-'+Math.random().toString(36).slice(2,6),date:typeof entry.date==='string'?entry.date.slice(0,60):'Importado',label:typeof entry.label==='string'?entry.label.slice(0,70):'',fields,metrics,selectedOpportunity:options.some(o=>o.name===entry.selectedOpportunity)?entry.selectedOpportunity:options[0].name};
  });
  const saved=[...cleaned,...readHistory()].slice(0,12);
  if(!writeHistory(saved))throw Error('Armazenamento local indisponível');
  renderHistory();$('historyFeedback').textContent=cleaned.length+' análise(s) importada(s) com sucesso. Todas devem ser reavaliadas antes de aprovação.';
 }catch(e){$('historyFeedback').textContent='Não foi possível importar: '+(e.message||'arquivo incompatível')+'. O histórico existente foi mantido.'}
});

$('compareA').addEventListener('change',renderHistoryComparison);
$('compareB').addEventListener('change',renderHistoryComparison);
$('clearHistory').addEventListener('click',()=>{if(!readHistory().length)return;if(window.confirm('Apagar todas as análises salvas neste navegador?')){writeHistory([]);renderHistory()}});
renderHistory();


/* Capture validation before any existing click handler mutates state. */
$('analisar').addEventListener('click',event=>{
 if(!validateScenario(true).ok){event.stopImmediatePropagation();event.preventDefault();show('diagnostico');}
},true);
$('aprovar').addEventListener('click',event=>{
 if(!validateScenario(true).ok){event.stopImmediatePropagation();event.preventDefault();approvalState='none';$('status').textContent='Revise as premissas inválidas antes de aprovar.';updateWorkflow();}
},true);
$('saveAnalysis').addEventListener('click',event=>{
 if(!validateScenario(true).ok){event.stopImmediatePropagation();event.preventDefault();$('saveAnalysisStatus').textContent='Corrija os valores inválidos para salvar a análise.';}
},true);
const financialInputs=['pessoas','minutos','minutosPorCaso','metodoTempo','vol','hora','dias','mensal','implantacao','extras','realizacao','economiaCaixa','pilotTempoAtual','pilotTempoMeta','pilotErroAtual','pilotErroMeta','pilotDias'];
financialInputs.forEach(id=>$(id).addEventListener('input',()=>{
 if(approvalState==='approved'){approvalState='none';$('status').textContent='Premissas alteradas. Aprovação anterior cancelada.';updateWorkflow()}
}));

})();
