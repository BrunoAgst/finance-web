# Finance App

Aplicação web para gerenciamento de despesas e débitos pessoais, desenvolvida com React e Vite.

## 📋 Sobre o Projeto

Finance App é uma aplicação de controle financeiro que permite aos usuários registrar, visualizar e editar suas despesas. O sistema oferece categorização de gastos, controle de parcelas, identificação de gastos fixos e uma interface intuitiva para gerenciamento completo das finanças pessoais.

## 🚀 Tecnologias Utilizadas

- **React 18+** - Biblioteca JavaScript para construção de interfaces
- **Vite** - Build tool e servidor de desenvolvimento
- **React Router DOM** - Roteamento e navegação entre páginas
- **Tailwind CSS** - Framework CSS utility-first para estilização
- **Lucide React** - Biblioteca de ícones

## ✨ Funcionalidades

- **Autenticação**
  - Tela de login com email e senha
  - Indicador de usuário logado
  - Botão de logout

- **Gestão de Débitos**
  - Cadastro de novos débitos com:
    - Nome da despesa
    - Valor
    - Data
    - Categoria (Crédito, Débito, PIX, Boleto, Parcelado)
    - Indicação de gasto fixo
    - Quantidade de parcelas (para gastos parcelados)
  - Visualização de lista de débitos
  - Edição de débitos existentes
  - Exclusão de débitos

- **Interface**
  - Design responsivo e centralizado
  - Esquema de cores harmônico (paleta slate)
  - Efeitos visuais em botões (hover e click)
  - Cards com sombras e bordas suaves
  - Logo personalizado da aplicação

## 📁 Estrutura do Projeto

```
src/
├── assets/          # Imagens e recursos estáticos
│   └── logo.png
├── components/      # Componentes reutilizáveis
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── Select.jsx
│   └── UserHeader.jsx
├── pages/           # Páginas da aplicação
│   ├── AddDebit.jsx
│   ├── EditDebit.jsx
│   ├── Home.jsx
│   ├── Login.jsx
│   └── ViewDebit.jsx
├── App.jsx
└── main.jsx         # Configuração de rotas
```

## 🛣️ Rotas

- `/` - Página inicial (Dashboard principal com formulário e lista de débitos)
- `/login` - Tela de autenticação
- `/edit-debit` - Tela de edição de débitos

## 🎨 Design System

### Cores

- **Background**: slate-50 (cinza azulado claro)
- **Botões**: slate-600/700 (cinza azulado escuro)
- **Cards**: branco com bordas slate-200
- **Texto**: cinza em diferentes tonalidades

### Componentes

- **Input/Select**: Campos com bordas sutis, foco com ring slate-400
- **Button**: Efeitos de hover (escurecimento) e active (escala 95%)
- **UserHeader**: Avatar circular, email e botão de logout

## 🔧 Como Executar

### Pré-requisitos

- Node.js instalado
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Build para produção
npm run build
```

### Acesso

Após executar `npm run dev`, acesse `http://localhost:5173` no navegador.

## 📝 Próximas Melhorias

- Integração com backend/API
- Persistência de dados
- Autenticação real com JWT
- Filtros e busca de débitos
- Gráficos e relatórios financeiros
- Exportação de dados
- Notificações de vencimento

## 👨‍💻 Desenvolvimento

Este projeto utiliza:

- ESLint para linting
- Vite para hot module replacement (HMR)
- Componentes funcionais com React Hooks

---

Desenvolvido com ⚛️ React + ⚡ Vite
