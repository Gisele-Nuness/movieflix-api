# Movieflix API

API REST para gerenciamento de filmes, gêneros e idiomas do Movieflix.

## Funcionalidades

- Listar todos os filmes
- Criar um novo filme
- Atualizar um filme existente
- Deletar um filme
- Filtrar filmes por gênero
- Documentação interativa via Swagger

## Tecnologias Utilizadas

- Node.js
- Express
- Prisma ORM
- Swagger UI

## Instalação

1. Clone o repositório:
   ```sh
   git clone https://github.com/Gisele-Nuness/movieflix-api.git
   cd movieflix-api
   ```

2. Instale as dependências:
   ```sh
   npm install
   ```

3. Configure o banco de dados no arquivo `.env` conforme sua preferência.

4. Execute as migrations do Prisma:
   ```sh
   npx prisma migrate dev
   ```

## Uso

1. Inicie o servidor:
   ```sh
   npm start
   ```

2. Acesse a documentação Swagger em:
   ```
   http://localhost:3000/docs
   ```

## Endpoints

- `GET /movies`  
  Lista todos os filmes cadastrados.

- `POST /movies`  
  Cria um novo filme.  
  Corpo esperado:
  ```json
  {
    "title": "Nome do Filme",
    "genre_id": 1,
    "language_id": 1,
    "oscar_count": 0,
    "release_date": "2024-01-01"
  }
  ```

- `PUT /movies/:id`  
  Atualiza um filme existente pelo ID.

- `DELETE /movies/:id`  
  Deleta um filme existente pelo ID.

- `GET /movies/:genreName`  
  Filtra filmes pelo nome do gênero.

## Estrutura dos Dados

Veja os esquemas detalhados na documentação Swagger (`swagger.json`).

## Contribuição

Pull requests são bem-vindos! Para grandes mudanças, abra uma issue primeiro para discutir o que deseja modificar.

