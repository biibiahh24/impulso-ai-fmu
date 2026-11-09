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
