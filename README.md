# Finance App 💰

Aplicação web moderna para gerenciamento de despesas e débitos pessoais, desenvolvida com React, Vite e integração com Keycloak.

## 📋 Sobre o Projeto

Finance App é uma aplicação completa de controle financeiro que permite aos usuários registrar, visualizar, editar e deletar suas despesas. O sistema oferece categorização de gastos, controle de parcelas, identificação de gastos fixos, visualização mensal com gráficos e uma interface intuitiva para gerenciamento completo das finanças pessoais.

## 🚀 Tecnologias Utilizadas

- **React 18+** - Biblioteca JavaScript para construção de interfaces
- **Vite** - Build tool e servidor de desenvolvimento ultra-rápido
- **React Router DOM** - Roteamento e navegação SPA
- **Tailwind CSS** - Framework CSS utility-first para estilização
- **Lucide React** - Biblioteca de ícones modernos
- **Recharts** - Biblioteca de gráficos React
- **Keycloak** - Autenticação e autorização (SSO)
- **Docker/Podman** - Containerização

## ✨ Funcionalidades

### 🔐 Autenticação

- Autenticação via **Keycloak** (OAuth2/OpenID Connect)
- Silent Check SSO para experiência sem interrupções
- Refresh automático de tokens
- Perfil de usuário com informações completas
- Logout seguro

### 💳 Gestão de Débitos

- **Cadastro** de novos débitos com:
  - Nome da despesa
  - Valor
  - Data (limitada a datas passadas e presente)
  - Categoria (Crédito, Débito, PIX, Boleto, Parcelado)
  - Indicação de gasto fixo (apenas para não-parcelados)
  - Quantidade de parcelas (2-12x para gastos parcelados)
- **Visualização** de últimas transações (30 dias)
  - Lista ordenada por data
  - Exibição do valor total da compra
  - Indicação visual de parcelas (ex: "Parcelado 12x")
  - Formatação de datas em PT-BR
- **Edição** de débitos existentes
  - Categoria e quantidade de parcelas fixas (não editáveis)
  - Campos editáveis: nome, valor, data, fixo
  - Mensagens de sucesso/erro
- **Exclusão** de débitos
  - Confirmação antes de deletar
  - Feedback visual durante exclusão

### 📊 Relatórios e Visualização

- **Dashboard Principal**
  - Total gasto no mês atual
  - Últimas 10 transações
  - Acesso rápido ao formulário
- **Gastos do Mês** (`/monthly`)
  - Navegação entre meses (← →)
  - Gráfico de pizza por categoria
  - Lista completa de gastos do mês
  - Total mensal calculado considerando parcelas
  - Indicação de parcelas específicas por mês (ex: "Parcelado 1")
- **Detalhes da Transação** (`/details`)
  - Visualização completa dos dados
  - Categoria traduzida em PT-BR
  - Exibição de parcelas quando aplicável
  - Campo "Fixo" oculto para parcelados

### 🎨 Interface

- Design responsivo e moderno
- Paleta de cores harmônica (slate/blue/green)
- Efeitos visuais em interações
- Cards com sombras e bordas suaves
- Loading states com spinners
- Mensagens de feedback (sucesso/erro)

## 📁 Estrutura do Projeto

```
finance-app/
├── public/
│   └── silent-check-sso.html     # SSO silencioso do Keycloak
├── src/
│   ├── assets/                    # Imagens e recursos estáticos
│   │   └── logo.png
│   ├── components/                # Componentes reutilizáveis
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── ProtectedRoute.jsx    # Proteção de rotas
│   │   ├── Select.jsx
│   │   └── UserHeader.jsx
│   ├── context/                   # Context API
│   │   └── AuthContext.jsx       # Gerenciamento de autenticação
│   ├── hooks/                     # Custom Hooks
│   │   └── useAuth.js
│   ├── pages/                     # Páginas da aplicação
│   │   ├── AddDebit.jsx          # Formulário de cadastro
│   │   ├── DebitDetails.jsx      # Detalhes da transação
│   │   ├── EditDebit.jsx         # Edição de débito
│   │   ├── Home.jsx              # Dashboard principal
│   │   ├── Login.jsx             # Página de login
│   │   ├── MonthlyPurchases.jsx  # Gastos mensais
│   │   └── ViewDebit.jsx         # Lista de transações
│   ├── services/                  # Serviços e API
│   │   └── api.js                # Comunicação com backend
│   ├── App.jsx                    # Componente raiz
│   ├── keycloak.js               # Configuração Keycloak
│   └── main.jsx                  # Entry point
├── .env.example                   # Template de variáveis
├── .env.docker                    # Variáveis para Docker
├── docker-compose.yml             # Orquestração de containers
├── Dockerfile                     # Build da imagem
├── nginx.conf                     # Configuração Nginx para SPA
├── DEPLOY.md                      # Guia de deploy
└── package.json
```

## 🛣️ Rotas

| Rota       | Descrição                   | Proteção       |
| ---------- | --------------------------- | -------------- |
| `/`        | Dashboard principal         | ✅ Autenticado |
| `/login`   | Página de login             | ❌ Pública     |
| `/monthly` | Gastos mensais com gráficos | ✅ Autenticado |
| `/details` | Detalhes da transação       | ✅ Autenticado |
| `/edit`    | Editar transação            | ✅ Autenticado |

## 🔌 API Endpoints

| Método   | Endpoint                 | Descrição                     |
| -------- | ------------------------ | ----------------------------- |
| `GET`    | `/v1/debts`              | Últimas transações (30 dias)  |
| `GET`    | `/v1/debts/month/{1-12}` | Transações por mês específico |
| `POST`   | `/v1/debts`              | Criar nova transação          |
| `PATCH`  | `/v1/debts/{id}`         | Atualizar transação           |
| `DELETE` | `/v1/debts/{id}`         | Deletar transação             |

## ⚙️ Variáveis de Ambiente

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/v1

# App Configuration
VITE_APP_URL=http://localhost:3000

# Keycloak Configuration
VITE_KEYCLOAK_URL=http://localhost:8085
VITE_KEYCLOAK_REALM=finance-api-dev
VITE_KEYCLOAK_CLIENT_ID=user-management-service
```

## 🔧 Como Executar

### Pré-requisitos

- Node.js 20+ instalado
- npm ou yarn
- Backend API rodando
- Keycloak configurado

### Instalação Local

```bash
# Clonar o repositório
git clone <repo-url>
cd finance-app

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com suas configurações

# Executar em modo de desenvolvimento
npm run dev
```

Acesse: `http://localhost:5173`

### 🐳 Executar com Docker/Podman

```bash
# Configurar variáveis
cp .env.docker .env
# Edite as URLs conforme necessário

# Build e executar
docker-compose up --build
# ou
podman-compose up --build
```

Acesse: `http://localhost:3000`

### 🏗️ Build para Produção

```bash
# Build
npm run build

# Preview do build
npm run preview
```

## 🚢 Deploy

Veja o arquivo [DEPLOY.md](DEPLOY.md) para instruções completas de deploy em:

- Portainer (via Stack)
- Docker Registry
- Build manual

### Deploy Rápido no Portainer

1. Acesse Portainer → `Stacks` → `Add stack`
2. Upload o `docker-compose.yml`
3. Configure as variáveis de ambiente
4. Deploy!

## 🎨 Design System

### Paleta de Cores

- **Background**: `slate-50` (cinza azulado claro)
- **Primária**: `blue-600` (azul vibrante)
- **Sucesso**: `green-500` (verde)
- **Erro**: `red-500` (vermelho)
- **Cards**: branco com bordas `slate-200`
- **Texto**: `gray-900`, `gray-600`, `gray-500`

### Componentes

- **Input/Select**: Bordas sutis, foco com ring
- **Button**: Hover + active states com transições
- **UserHeader**: Avatar, nome do usuário, logout
- **Cards**: Shadow-md, bordas arredondadas

## 🔒 Segurança

- Tokens JWT gerenciados pelo Keycloak
- Refresh automático de tokens (a cada 60s)
- Rotas protegidas via `ProtectedRoute`
- PKCE (Proof Key for Code Exchange) habilitado
- Headers de segurança no Nginx:
  - `X-Frame-Options: SAMEORIGIN`
  - `X-Content-Type-Options: nosniff`
  - `X-XSS-Protection: 1; mode=block`

## 📊 Gráficos e Relatórios

- **Gráfico de Pizza**: Distribuição de gastos por categoria
- **Percentuais**: Exibição visual da proporção de cada categoria
- **Totais**: Cálculo automático considerando parcelas
- **Navegação Temporal**: Visualize gastos de qualquer mês

## 🐛 Troubleshooting

### Data aparece um dia a menos

✅ Resolvido: Formatação correta de datas sem conversão de timezone

### Erro de redirect_uri no Keycloak

Configure no Keycloak Admin:

- Valid redirect URIs: `http://localhost:3000/*`
- Web origins: `http://localhost:3000`

### Build Docker com variáveis

Use `--build-arg` para passar variáveis no build

## 👨‍💻 Desenvolvimento

### Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Verificar código
```

### Padrões de Código

- Componentes funcionais com Hooks
- Context API para gerenciamento de estado global
- Axios-like fetch para chamadas HTTP
- Formatação consistente de datas
- Tradução de categorias centralizada

## 📝 Melhorias Futuras

- [ ] Modo escuro
- [ ] Exportação de relatórios (PDF/Excel)
- [ ] Gráficos de linha para tendências
- [ ] Filtros avançados de busca
- [ ] Notificações de vencimento
- [ ] Metas de gastos mensais
- [ ] Multi-idioma (i18n)
- [ ] PWA (Progressive Web App)

## 📄 Licença

Este projeto está sob licença MIT.

---

Desenvolvido com ⚛️ React + ⚡ Vite + 🔐 Keycloak
