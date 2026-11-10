# IMPULSO AI
**Da intenção à implementação.**

Projeto acadêmico da **Missão 2 — IA Transformando Negócios**, FMU, a partir da pesquisa realizada durante o AI Brasil Experience 2026.

> **ENTREGA FMU:** [Ver checklist oficial, três entregáveis e pendências antes do LXP](ENTREGA-FMU.md). O repositório já contém os três artefatos em `entregaveis/`, mas a conferência de evidências e o envio do link ao LXP ainda são necessários.

## Acesso
- **Protótipo:** https://impulso-ai-fmu-oliverrbiahh10-4202.vercel.app
- **Apresentação editável no Canva (8 slides):** https://www.canva.com/d/aij3bnHcRKTj5HQ
- **Apresentação de oito slides depositada no GitHub:** [entregaveis/03-business-case.html](entregaveis/03-business-case.html)
- **Roteiro de apresentação oral:** [docs/roteiro-apresentacao.md](docs/roteiro-apresentacao.md)
- **Repositório:** https://github.com/biibiahh24/impulso-ai-fmu

## Problema
Pequenas e médias empresas têm dificuldade para identificar oportunidades de IA, avaliar prontidão de dados e equipes, calcular retorno econômico e executar automações com governança.

## Proposta
O IMPULSO AI é uma proposta de plataforma **B2B SaaS** que orienta a adoção de IA por cinco funções: diagnóstico, recomendações, simulação de ROI, aprovação humana e indicadores de resultado.

## Protótipo executável
O site em `index.html` é um **protótipo web estático**, sem bibliotecas, banco de dados ou API de IA. O diagnóstico usa regras demonstrativas; a simulação financeira é calculada por fórmulas locais; as propostas de automação e decisões são conceituais. Não há envio das respostas a um servidor.

Para testar localmente, abra `index.html` no navegador, mantendo as pastas `css/` e `js/` no mesmo diretório. O CSS e o JavaScript estão organizados em arquivos separados.

**Não confundir este protótipo com uma plataforma SaaS operacional.** Custos, benefícios, ROI e indicadores apresentados em cenários do sistema são hipóteses acadêmicas.

## Pesquisa complementar com fontes verificadas

- **[Pesquisa documental das seis empresas](docs/pesquisa-complementar-seis-empresas.md)** — distingue entrevista (E), sites oficiais (P) e análise acadêmica (A); detalha custos, benefícios, ROI, maturação, barreiras, habilidades, critérios de validação e links das fontes.
- **[Matriz comparativa atualizada](docs/matriz-comparativa.md)** — coteja os seis casos e explicita o que ainda depende de orçamento ou evidência específica.
- **[Relatório principal atualizado](entregaveis/01-relatorio-mvp.html)** — integra a pesquisa complementar às seções 3 a 5 e às referências.
- A ausência de preço ou ROI público de um fornecedor **não deve ser substituída por valor inventado**. O modelo financeiro hipotético pertence ao IMPULSO AI, não aos seis fornecedores.

## Empresas analisadas
1. **WebGlobal / AiProtus:** robôs interativos e IA; desafios logísticos relatados.
2. **Aditum:** agentes inteligentes em processos de pagamento; adoção por equipes e priorização.
3. **Digibee:** integração de sistemas; governança, segurança e integração. Estudo TEI específico reporta 232% de ROI — não é retorno geral garantido pela IA.
4. **Cilia:** orçamentação automotiva com auxílio de IA; reconhecimento visual, precisão, diversidade de fotos e validação humana são desafios técnicos plausíveis.
5. **HugLabs:** análise e classificação documental; adaptação aos processos do cliente.
6. **Leavo AI:** agentes de atendimento e vendas integrados a WhatsApp/CRM; desafios de integração, dados, resposta e privacidade são análises técnicas plausíveis.

Os pontos relacionados a Cilia e Leavo AI não devem ser apresentados como citações diretas de seus representantes. Onde não há dados financeiros, registra-se **não informado**, sem inventar indicadores.

## Conteúdo
- `index.html` — demonstração interativa.
- `entregaveis/01-relatorio-mvp.html` — relatório completo formatado para salvar como PDF.
- `entregaveis/02-fluxograma.svg` — fluxograma visual da jornada, com decisões humanas e KPIs.
- **Canva** — apresentação de oito slides editável pelo link acima (exportar PDF final para a pasta do repositório antes da entrega).
- `docs/matriz-comparativa.md` — síntese de pesquisa.
- `docs/mvp-e-viabilidade.md` — problema, produto, modelo de negócio e cenário financeiro.
- `docs/jornada.md` — fluxograma Mermaid com decisões humanas.
- `docs/business-case.md` — roteiro de oito slides e apresentação.
- `entregaveis/03-business-case.html` — versão da apresentação executiva de oito slides, acessível diretamente pelo GitHub e navegador.
- `ENTREGA-FMU.md` — auditoria completa dos requisitos, arquivos e pendências da submissão.


## IMPULSO AI 3.0 — Atualização de 9/11/2026

A interface foi ampliada com cadastro de contexto da empresa (nome, setor, porte e objetivo), plano de ação por dimensão, bloqueio explícito da aprovação simulada caso os dados sejam insuficientes ou não existam controles de segurança, seleção entre oportunidades, três cenários de realização do benefício (25%, 50% e 100%) e relatório executivo gerado no próprio navegador.

Para demonstrar o fluxo: **Diagnóstico** → configure empresa e processo → **Gerar diagnóstico** → **Recomendações** e seleção de oportunidade → **Simulador de ROI** → **Jornada** → **Relatório**. Na tela de relatório, use **Imprimir / salvar PDF**; se preferir um documento local, escolha **Baixar relatório HTML**.

### Limitações e regras de interpretação

- O índice de prontidão é calculado por regras pedagógicas, e não por IA real.
- Ausência de controles de segurança ou dados insuficientes bloqueia a aprovação no fluxo simulado, mesmo com pontuação elevada em outros critérios.
- Cenários de ROI são hipóteses econômicas. Tempo liberado **não significa** redução automática de gastos, nem comprova lucro.
- O relatório exportado contém os dados introduzidos pelo usuário. Recomenda-se não inserir informações pessoais ou sigilosas no protótipo público.
- Não há autenticação, persistência, processamento em servidor, base de dados ou integração com modelos de IA.


## Revisão final do protótipo — 9/11/2026

- Dashboard sincronizado com o nome, setor, porte, processo e oportunidade em análise; removido o indicador fictício de oito processos mapeados (um processo na demonstração).
- Indicação explícita de dados fictícios e hipóteses econômicas nas telas iniciais.
- Diagnóstico e bloqueios atualizados sempre que dados, equipe, integração ou segurança mudam. Mudanças invalidam a aprovação demonstrativa anterior.
- Teste automatizado em navegador Chromium: alteração do perfil, bloqueio por ausência de controles/dados, aprovação após correção, ROI atualizado, relatório com dados da empresa e exportação HTML; nenhum erro JavaScript detectado.
- Teste em viewport móvel de 390 pixels sem rolagem horizontal; PDF gerado no navegador.
- A configuração de autenticação da Vercel foi desativada para permitir acesso público ao site durante a avaliação FMU. Não inserir informações sigilosas, pois o protótipo é público.


## Upgrade funcional de UX — 09/11/2026

Além do visual, o MVP passou a orientar o usuário em **cinco etapas reais da demonstração**: diagnóstico, seleção de oportunidade, simulação econômica, aprovação humana e geração de relatório. O painel de progresso é atualizado pelas ações realizadas, não por cronômetro ou animação decorativa.

- **Priorização contextual demonstrativa:** mudar o objetivo da empresa altera a ordem das três oportunidades e explica por que uma delas é mais compatível com o objetivo. Trata-se de regras explícitas e auditáveis, sem alegação de IA generativa em execução.
- **Rastreabilidade das decisões:** o dashboard indica etapa atual e próxima ação; alterar variáveis do cenário invalida a aprovação simulada anterior.
- **Linguagem de produto:** a tela usa “Oportunidades para avaliar” e “Analisar prontidão”, evitando dar a entender que uma IA real está sendo executada.
- **Testes automatizados:** navegador Chromium em 1440 px e 390 px, com fluxo de diagnóstico → seleção → ROI → bloqueio por dados insuficientes → aprovação após correção → download de relatório, além de ordenação contextual por objetivo. Sem erros de JavaScript ou rolagem horizontal nos dois tamanhos.

**Limitações mantidas:** não há banco de dados, login, sincronização entre dispositivos nem conexão com modelo de IA. As decisões são locais e ilustrativas. O indicador de conclusão representa apenas tarefas demonstradas nesta sessão.

## Revisão de funcionamento e fluxo — 09/11/2026

- Fluxo demonstrativo de **cinco etapas** testado em desktop (1440px) e celular (390px).
- A aprovação agora **exige** diagnóstico concluído, oportunidade selecionada, revisão de pelo menos uma premissa econômica e ausência de bloqueios de dados/segurança.
- O relatório executivo distingue **aprovação simulada**, **revisão solicitada** e **ausência de aprovação**; nenhuma dessas decisões executa integrações reais.
- **Rascunho local:** botões de salvar, recuperar e apagar as informações neste navegador via `localStorage`. Não existe conta, sincronização, histórico remoto ou armazenamento em servidor. Ao recuperar um rascunho, o fluxo e as aprovações são reiniciados, exigindo reavaliação.
- Testes automatizados em Chromium: atualização de empresa e objetivo, ranking contextual, ROI, aprovação bloqueada e aprovada, relatório com dados da empresa, download HTML, recuperação local após recarregamento, eliminação do rascunho; **zero erros JavaScript** e sem rolagem horizontal.
- Limitações: o sistema é um **MVP conceitual**, com recomendações por regras e números hipotéticos. Integrações reais, autenticação, banco de dados e modelos de IA não estão implementados.

## Atualização do produto — Modelos, relatório, histórico e indicadores (09/11/2026)

Quatro melhorias funcionais de alta e média prioridade foram implementadas e estão disponíveis no site publicado:

1. **Modelos prontos de empresa:** botões **Comércio**, **Serviços** e **Indústria** na tela Diagnóstico, que preenchem um contexto completo de exemplo com volume, processo, dados, equipe, segurança e premissas de ROI. Os cenários são totalmente fictícios, editáveis e reiniciam aprovações anteriores.
2. **Indicadores ligados ao processo:** o volume diário do diagnóstico alimenta o simulador. No modo **Baseado no volume**, minutos economizados por pessoa por dia = (solicitações/dia × minutos poupados por solicitação) ÷ funcionários. O sistema calcula solicitações mensais, tempo liberado e ROI. Há também modo **Manual**, explicitamente identificado, para preservar cenários independentes.
3. **Histórico e comparação local:** botão **Salvar análise no histórico** após diagnóstico e escolha de oportunidade. Até 12 registros ficam no armazenamento local do navegador e podem ser restaurados, excluídos ou comparados em prontidão, horas/mês, benefícios, custos e ROI. Não existe banco de dados remoto; ao restaurar, decisões anteriores não são reaproveitadas.
4. **Relatório executivo visual:** capa personalizada, quatro indicadores, tabela de prontidão, plano de ações, oportunidade escolhida, gráfico comparativo de benefício/custo/saldo, cálculo econômico e governança. Na seção **Relatório**, use **Gerar PDF** e, na janela de impressão do navegador, escolha **Salvar como PDF**. O HTML complementar também pode ser baixado.

**Validação em navegador Chromium:** modelos de comércio e indústria, cálculo derivado do volume, alteração do tempo por solicitação, histórico com dois registros, comparação com variações numéricas, recuperação com progresso reiniciado, bloqueios e aprovações, relatório com três barras e quatro KPIs, download HTML e geração de PDF válido (assinatura PDF-1.4). Sem erros JavaScript identificados; testes em desktop e celular. Os resultados são **simulações acadêmicas**, não provas de ROI observado ou IA real.

## IMPULSO AI 4.0 — Validação, painel decisório, ROI e acompanhamento (10/11/2026)

Após a implementação de modelos prontos, histórico e relatório visual, o sistema recebeu as seguintes melhorias **efetivamente implementadas**:

- **Validação consistente:** nome do projeto, processo, descrição, volume, equipe, jornada, percentuais, gastos, metas e dias úteis são validados antes de diagnosticar, aprovar, salvar histórico ou exportar resultados. Ex.: zero funcionários, jornada economizada superior a 8 h/pessoa/dia e meta pior que a referência bloqueiam a ação e exibem mensagens específicas. Não existe aprovação de simulação inválida.
- **Dashboard dinâmico:** exibe índice de prontidão, situação da decisão humana, quantidade mensal de solicitações e situação dos controles/consistência. Todos derivam dos valores reais da sessão.
- **Transparência do ROI:** separa **valor econômico da capacidade liberada** de uma premissa opcional de **economia comprovável em caixa**, exibindo saldo e ROI financeiro apenas de caixa; as grandezas **não são somadas automaticamente** para impedir dupla contagem. Mostra também a fração de aproveitamento da capacidade necessária para equilíbrio econômico. Esses resultados são cenários acadêmicos, não economias reais.
- **Histórico avançado (local):** busca por empresa, processo ou nome do cenário, renomeação, exclusão, comparação e **exportação/importação JSON** com restrições de tamanho e estrutura. O histórico permanece apenas no dispositivo. Importar ou restaurar não restaura aprovações.
- **Metas do piloto:** o usuário informa tempo de atendimento e taxa de retrabalho atuais e desejados, além do período. O protótipo calcula volume estimado, horas potencialmente liberadas e melhoria-alvo — **não** resultados medidos.
- **Relatório executivo:** identificação do cenário, data e hora, 4 indicadores, prioridades de risco, gráfico comparativo, custos/ROI, distinção entre capacidade e caixa, metas do piloto, governança e RAs do grupo. A opção **Gerar PDF** abre a caixa de impressão para **Salvar como PDF**; o documento possui paginação A4 numerada. A exportação HTML também preserva o estilo do relatório.
- **Governança:** alterações de premissas invalidam aprovações anteriores. O painel de progresso só avança depois de um diagnóstico realmente válido, sem múltiplos manipuladores contraditórios.

**Verificações realizadas em Chromium:** cenários de serviços, comércio e indústria, dados inválidos, metas inválidas, aprovação bloqueada e aprovada, alteração pós-aprovação, ROI de caixa, break-even, relatório datado, documento A4 paginado e legível, histórico com filtro/renomeação/exportação/importação, desktop 1440 px e mobile 390 px, sem erros JavaScript e sem rolagem horizontal. Os três entregáveis da Missão 2 permanecem no repositório. **Não existem login, banco de dados ou API de IA real; trata-se de um MVP conceitual com regras auditáveis.**

## Integrantes do grupo
- **Beatriz Ramos — RA 2025116740**
- **Nicole Santos Damaceno — RA 2025102325**
- **Victoria Maria de Carvalho Franca — RA 2025102342**
- **Kauã da Silva Viturino — RA 2025102893**

**Prazo previsto da entrega acadêmica:** 11 de novembro de 2026.

## Referências e evidências
- Entrevistas e anotações coletadas no AI Brasil Experience 2026 pelo grupo FMU.
- Digibee / Forrester TEI (2022): https://marketing.digibee.com/forrester-total-economic-impact-report-digibee-2022
- Leavo AI: https://www.leavo.ai/

Os estudos e os relatos devem ser conferidos com o material original antes da submissão final. A publicação pública de imagens, vídeos ou dados pessoais dos entrevistados requer cuidado com privacidade e autorização.
