"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client"); // Importa o Prisma Client para interagir com o banco de dados
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("../swagger.json"));
const port = 3000;
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use(express_1.default.json()); // Middleware para interpretar JSON no corpo das requisições
app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default)); // Configuração do Swagger para documentação da API
// APRESENTAR OS FILMES CADASTRADOS
app.get('/movies', async (req, res) => {
    const movies = await prisma.movies.findMany({
        orderBy: {
            title: 'asc'
        },
        include: {
            genres: true,
            languages: true
        }
    });
    res.json(movies);
});
// CRIAR UM NOVO FILME
app.post('/movies', async (req, res) => {
    const { title, genre_id, language_id, oscar_count, release_date } = req.body;
    try {
        //Verificar no banco se já existe um filme com o mesmo título
        const movieWithSameTitle = await prisma.movies.findFirst({
            where: { title: { equals: title, mode: 'insensitive' } },
        });
        if (movieWithSameTitle) {
            return res.status(409).send({ message: 'Já existe um filme com esse título.' });
        }
        await prisma.movies.create({
            data: {
                title: title,
                genre_id: genre_id,
                language_id: language_id,
                oscar_count: oscar_count,
                release_date: new Date(release_date)
            }
        });
    }
    catch (error) {
        return res.status(500).send({ error: 'Erro ao cadastrar o filme.' });
    }
    res.status(201).send({ message: 'Filme criado com sucesso!' });
});
// ATUALIZAR UM FILME EXISTENTE
app.put('/movies/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const movie = await prisma.movies.findUnique({
            where: { id }
        });
        if (!movie) {
            return res.status(404).send({ message: 'Filme não encontrado.' });
        }
        const data = { ...req.body }; // Obtém os dados do corpo da requisição
        data.release_date = data.release_date ? new Date(data.release_date) : undefined;
        await prisma.movies.update({
            where: { id }, // Atualiza o filme com o ID fornecido na URL
            data: data // Dados a serem atualizados
        });
    }
    catch (error) {
        return res.status(500).send({ error: 'Erro ao atualizar o filme.' });
    }
    res.status(200).send('Dados atualizados com sucesso!!!');
});
// DELETAR UM FILME EXISTENTE
app.delete('/movies/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const movie = await prisma.movies.findUnique({
            where: { id }
        });
        if (!movie) {
            return res.status(404).send({ message: 'Filme não encontrado.' });
        }
        await prisma.movies.delete({ where: { id } }); // Deleta um filme do banco de dados DELETE 
    }
    catch (error) {
        return res.status(500).send({ error: 'Erro ao deletar o filme.' });
    }
    res.status(200).send({ message: 'Filme deletado com sucesso!' });
});
// FILTRO POR GÊNERO
app.get('/movies/:genreName', async (req, res) => {
    try {
        const genreName = req.params.genreName;
        const moviesFilteredByGenre = await prisma.movies.findMany({
            include: {
                genres: true,
                languages: true
            },
            where: {
                genres: {
                    name: {
                        equals: genreName, // Filtra os filmes pelo nome do gênero
                        mode: 'insensitive' // Ignora diferenças entre maiúsculas e minúsculas
                    }
                }
            }
        });
        if (moviesFilteredByGenre.length === 0) {
            return res.status(404).send({ message: 'Nenhum filme encontrado para o gênero.' });
        }
        res.status(200).send(moviesFilteredByGenre);
    }
    catch (error) {
        return res.status(500).send({ error: 'Erro ao filtrar os filmes por gênero.' });
    }
});
app.listen(port, () => {
    console.log(`Servidor rodando na porta http://localhost:${port}`);
});
