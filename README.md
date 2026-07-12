<div align="center">
  <img src="https://nano.net.br/assets/programacao-DzAvORjU.png" width="50" alt="Logo NANO" />
  
  # NANO
  
  ### TECNOLOGIA SOB MEDIDA
</div>

---

# ASPEB Benefícios - Saúde & Proteção Familiar

## Visão Geral

O **ASPEB Benefícios** é uma plataforma digital de alta conversão projetada para apresentar, simular e contratar planos de saúde, clube de vantagens e seguros de vida com foco na Região Norte do Brasil. A solução atende a famílias e profissionais autônomos, proporcionando clareza e transparência no cálculo de retornos financeiros por meio de economia amortizada. 

Através de uma interface moderna e de alta fidelidade visual, o usuário realiza um onboarding simplificado, parametriza suas coberturas de morte e invalidez (garantidos pela Icatu Seguros), seleciona benefícios opcionais (como descontos em farmácias, telemedicina e consultas) e visualiza em tempo real um painel dinâmico comparativo contendo o retorno de investimento (ROI) e o custo líquido mensal resultante de sua adesão.

---

## Funcionalidades Principais

> **Onboarding Dinâmico e Personalizado**  
> Coleta de dados básicos do usuário (idade, profissão e principais preocupações de bem-estar) de forma intuitiva, permitindo que a aplicação gere recomendações sob medida instantaneamente.

> **Simulador de Coberturas e Benefícios**  
> Painel iterativo de controle deslizante (sliders) para coberturas de morte e invalidez associadas a multiplicadores atuariais baseados na faixa etária do usuário, acoplado à seleção de pacotes de assistência adicionais.

> **Mecanismo de Cálculo de ROI (Widget de Retorno)**  
> Exibição dinâmica em tempo real do custo total mensal do plano versus a economia estimada com os benefícios selecionados (como consultas subsidiadas e descontos em farmácias), calculando o custo líquido efetivo do associado.

> **Checkout Integrado e Simulações Históricas**  
> Modal de fechamento para preenchimento de faturamento e dados de cobrança, junto com um painel de histórico persistente no navegador para recuperar simulações anteriores salvando perfis e coberturas customizadas.

> **Interações e Revelação de Conteúdo Premium**  
> Transições de alta performance integradas com rolagem suave (Scroll Reveal) e indicadores dinâmicos de progresso, aprimorando significativamente a retenção de usuários e a credibilidade corporativa.

---

## Stack Técnica

| Categoria | Tecnologia |
|---|---|
| **Linguagem Principal** | TypeScript (~v5.8.2) |
| **Framework Base** | React (v19.0.1) |
| **Ferramenta de Build** | Vite (v6.2.3) |
| **Estilização** | Tailwind CSS (v4.1.14) com @tailwindcss/vite |
| **Engine de Animação** | Motion (v12.23.24) |
| **Ícones** | Lucide-React (v0.546.0) |
| **Servidor Local / Dev** | Node.js + Express (v4.21.2) integrado |
| **Persistência de Dados** | LocalStorage (Estado do cliente para histórico e sessões) |
| **Controle de Tipagem** | TypeScript Estrito (Estrito em contratos, enums e interfaces) |
| **CI/CD / Pipeline** | GitHub Actions (deploy automatizado via gh-pages) |

---

## Arquitetura do Projeto

A arquitetura do projeto segue rígidos padrões de modularização, desacoplamento e forte tipagem com TypeScript, estruturada de forma modular para fácil manutenção e expansão.

*   **Separação de Responsabilidades (SoC):** A lógica de negócios, cálculos de multiplicadores atuariais e dados estáticos de seguros estão isolados na pasta `/src/data`, mantendo os componentes visuais focados unicamente na renderização e feedback de interface.
*   **Contratos e Tipos Globais:** A definição de dados de entrada, perfis, coberturas e resultados de simulações estão centralizados em `/src/types.ts`. Isso previne inconsistências de estado e assegura a integridade de ponta a ponta.
*   **Acoplamento de Interface Suave (Microinterações):** A utilização de animações baseadas no ciclo de vida de componentes (com `AnimatePresence` do Motion) garante uma transição fluida ao alternar entre etapas de onboarding e painéis de simulação, mantendo o usuário engajado sem perdas abruptas de foco.

---

## Estrutura de Pastas

Abaixo está descrita a árvore estrutural das principais pastas e arquivos contidos no projeto:

```text
/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Pipeline de Integração e Deploy Contínuo (GitHub Actions)
├── assets/                     # Assets estáticos e imagens do projeto
├── src/
│   ├── components/             # Componentes modulares e reutilizáveis
│   │   ├── BenefitCard.tsx     # Cartão individual de benefícios e assistências
│   │   ├── CheckoutModal.tsx   # Modal de finalização e faturamento de propostas
│   │   ├── CoverageSlider.tsx   # Painel interativo para ajuste e cálculo de coberturas
│   │   ├── Onboarding.tsx      # Formulário guiado com passos para captação de perfil
│   │   ├── PastSimulations.tsx # Lista com histórico de simulações salvas no navegador
│   │   ├── RoiWidget.tsx       # Widget analítico que calcula a economia líquida e ROI
│   │   └── ScrollReveal.tsx    # Componente utilitário de animação com fade-in e slide-up sob rolagem
│   ├── data/
│   │   └── insuranceData.ts    # Lógica atuarial, multiplicadores e dados de simulação
│   ├── types.ts                # Definições de interfaces, tipos e estruturas estritas
│   ├── App.tsx                 # Ponto de montagem global, roteamento e fluxos da aplicação
│   ├── index.css               # Folha de estilos global do projeto com injeção do Tailwind CSS
│   └── main.tsx                # Inicializador de aplicação React
├── package.json                # Gerenciamento de dependências, scripts e metadados npm
├── tsconfig.json               # Configurações do compilador TypeScript
└── vite.config.ts              # Configurações do compilador Vite e plugins de otimização
```

---

## Instalação e Execução

### Pré-requisitos
Certifique-se de possuir em sua máquina as seguintes ferramentas de ambiente instaladas:
*   **Node.js** (Versão 20 ou superior recomendada)
*   **npm** (Versão 10 ou superior)

### Passo a Passo para Configuração Local

1. **Clonar o Repositório**
   ```bash
   git clone https://github.com/seu-usuario/ASPEB---Smart-Family-Shield.git
   cd ASPEB---Smart-Family-Shield
   ```

2. **Instalar Dependências**
   ```bash
   npm install
   ```

3. **Executar em Ambiente de Desenvolvimento**
   ```bash
   npm run dev
   ```
   *Após rodar o comando, a aplicação estará acessível localmente em `http://localhost:3000`.*

4. **Gerar a Build de Produção**
   ```bash
   npm run build
   ```
   *Os arquivos estáticos compilados e minificados prontos para deploy estarão disponíveis na pasta `/dist`.*

---

## Scripts Disponíveis

Abaixo estão os scripts definidos no `package.json` para facilitar os fluxos de trabalho e verificação:

| Script | Comando | Descrição |
|---|---|---|
| **dev** | `vite --port=3000 --host=0.0.0.0` | Inicia o servidor local de desenvolvimento na porta 3000. |
| **build** | `vite build` | Compila o projeto em TypeScript e empacota para produção em `/dist`. |
| **preview** | `vite preview` | Executa um servidor local servindo a versão de produção gerada em `/dist`. |
| **clean** | `rm -rf dist server.js` | Remove pastas temporárias e artefatos gerados em compilações passadas. |
| **lint** | `tsc --noEmit` | Executa o compilador TypeScript no modo de checagem técnica sem emitir arquivos. |

---

## Deploy

O fluxo de Deploy está totalmente automatizado no projeto através da tecnologia **GitHub Actions**.

### Pipeline de Integração e Entrega Contínua (CI/CD)
O arquivo de workflow localizado em `.github/workflows/deploy.yml` é acionado automaticamente a cada alteração ou `push` realizado nos ramos (`branches`) `main` ou `master`. 

O fluxo segue os seguintes estágios sequenciais:
1.  **Checkout:** Extração e leitura do código fonte do repositório no agente virtual (Ubuntu Linux).
2.  **Configuração do Node.js:** Instanciação automatizada do ambiente Node.js na versão LTS atual (Node 20).
3.  **Instalação de Dependências:** Execução do `npm install` limpo para baixar os pacotes declarados.
4.  **Lint / Validação:** Execução do script `npm run lint` (`tsc --noEmit`) para garantir que o código esteja livre de avisos, tipagens incorretas ou bugs de compilação.
5.  **Compilação (Build):** Geração do diretório otimizado e minificado `/dist` utilizando o Vite.
6.  **Deploy Automático:** Através da action corporativa `JamesIves/github-pages-deploy-action`, o diretório `/dist` é automaticamente publicado na branch `gh-pages` do seu repositório, disponibilizando a landing page em produção de forma transparente.

---

## Considerações Técnicas e Arquiteturais

### Padrões de Qualidade de Código
*   **Tipagem Forte com TypeScript:** Evita-se totalmente a utilização de tipos abertos como `any`. Todos os componentes possuem tipos explícitos para suas `props` e funções, promovendo facilidade na manutenção preventiva e legibilidade rápida.
*   **Design Responsivo com Tailwind CSS:** Implementação com conceito móvel em primeiro lugar (*Mobile First*), oferecendo adaptação precisa para dispositivos móveis, tablets e telas widescreen de alta densidade por meio de grades fluidas (`grid`) e espaçamento proporcional.
*   **Suavidade com Motion:** Interações com atraso escalonado (*staggered delays*) e curvas de velocidade customizadas (como Bezier cúbico premium) que guiam o olhar do usuário pelas diferentes seções, resultando em menor fadiga visual.
*   **Segurança e Confiabilidade Estática:** Configuração do compilador em modo estrito para interceptar anomalias de tipagem em tempo de escrita, minimizando riscos de falhas em ambiente de execução.

---

## 🚀 Desenvolvido por

> **Sandro Peixoto**  
> https://www.sandropeixoto.com.br
>
> **NANO**  
> https://nano.net.br
