Projeto: Gerenciador de Estoque
Descrição
O Gerenciador de Estoque é uma aplicação web que permite aos usuários gerenciar seus produtos, categorias e estoques de forma eficiente. Este projeto foi desenvolvido seguindo práticas de Test-Driven Development (TDD) para garantir a qualidade do código e facilitar a manutenção.

# Funcionalidades
* Adicionar, editar e remover produtos
* Adicionar, editar e remover categorias de produtos
* Visualizar o estoque atual
* Histórico de movimentações de estoque
* Autenticação de usuário (login e registro)
* Tecnologias Utilizadas
* Frontend: React.js
* Backend: Node.js com Express
* Banco de Dados: PostgreSQL
* ORM: Prisma
* Autenticação: JWT
* Testes: Jest e Supertest

# Práticas de TDD

Este projeto foi desenvolvido utilizando Test-Driven Development (TDD). Abaixo estão os passos seguidos para cada funcionalidade:

Escrever um Teste: Antes de implementar uma nova funcionalidade, um teste foi escrito para definir o comportamento esperado.
Executar o Teste: O teste foi executado e, como esperado, falhou, pois a funcionalidade ainda não estava implementada.
Implementar a Funcionalidade: O código necessário para passar o teste foi escrito.
Refatorar: O código foi refatorado para melhorar sua estrutura e legibilidade, garantindo que todos os testes continuassem passando.
Repetir: Esse ciclo foi repetido para cada nova funcionalidade adicionada ao projeto.
Estrutura do Projeto:


├── backend<BR>
 │   ├── src <BR>
│   │   ├── controllers <BR>
│   │   ├── models <BR>
│   │   ├── routes <BR>
│   │   ├── services <BR>
│   │   ├── tests <BR>
│   │   └── app.js <BR> 
│   └── package.json <BR>
├── frontend <BR>
│   ├── public <BR> 
│   ├── src <BR>
│   │   ├── components <BR>
│   │   ├── pages <BR>
│   │   ├── services <BR>
│   │   └── App.js <BR>
│   └── package.json <BR>
└── README.md


Como Executar o Projeto

## Pré-requisitos
- Node.js
- PostgreSQL

## Configuração
- Clone o repositório:
  
bash:
``
git clone https://github.com/usuario/gerenciador-de-estoque.git
cd gerenciador-de-estoque
``

### Configure as variáveis de ambiente:
  Crie um arquivo .env na raiz dos diretórios backend e frontend com as seguintes variáveis:
  env

# Backend
DATABASE_URL=postgresql://user:password@localhost:5432/gerenciador_de_estoque
JWT_SECRET=your_secret_key

# Frontend

REACT_APP_API_URL=http://localhost:5000
Instale as dependências:

# Backend
``
cd backend
npm install
``
# Frontend
cd ../frontend
npm install
Executar a Aplicação
Inicie o backend:

bash
Copy code
cd backend
npm start
Inicie o frontend:

bash
Copy code
cd ../frontend
npm start
Executar os Testes
Para executar os testes, utilize o seguinte comando na raiz do diretório backend:

bash
``
npm test
``

# Contribuição
Contribuições são bem-vindas! Por favor, siga os passos abaixo para contribuir:

Fork o repositório
Crie uma branch para sua feature ``(git checkout -b feature/nova-feature)``
Commit suas mudanças ``(git commit -m 'Adiciona nova feature')``
Faça o push para a branch ``(git push origin feature/nova-feature)``


Abra um Pull Request

## Licença
Este projeto está licenciado sob a MIT License.

