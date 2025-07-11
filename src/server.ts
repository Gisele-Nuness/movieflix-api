import express from 'express';
import { PrismaClient } from './generated/prisma';

const port = 3000;
const app = express();
const prisma = new PrismaClient();

app.use(express.json()); // Middleware para interpretar JSON no corpo das requisições

app.get('/movies', async(req, res) => {
  const movies = await prisma.movies.findMany({ //select no banco de dados *from movies
    orderBy: { // Ordena os filmes pelo título em ordem ascendente
      title: 'asc'
    },
    include: { // Inclui as relações com os gêneros e idiomas
      genres: true,
      languages: true
    }
  });
  res.json(movies);
});

app.post('/movies', async(req, res) => {

  const { title, genre_id, language_id, oscar_count, release_date } = req.body;
  
  try {
    await prisma.movies.create({ // Insere um novo filme no banco de dados
      data: {
        title: title,
        genre_id: genre_id,
        language_id: language_id,
        oscar_count: oscar_count,
        release_date: new Date(release_date)
      }
  });
  } catch (error) {
    return res.status(500).send({ error: 'Erro ao cadastrar o filme.' });
  }
  
  res.status(201).send({ message: 'Filme criado com sucesso!' });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta http://localhost:${port}`);
});