import express from 'express';
import { PrismaClient } from './generated/prisma';

const port = 3000;
const app = express();
const prisma = new PrismaClient();

app.use(express.json()); // Middleware para interpretar JSON no corpo das requisições

// APRESENTAR OS FILMES CADASTRADOS
app.get('/movies', async (req, res) => {
  const movies = await prisma.movies.findMany({ //select no banco de dados *from movies SELECT
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

    await prisma.movies.create({ // Insere um novo filme no banco de dados INSERT
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

// ATUALIZAR UM FILME EXISTENTE
app.put('/movies/:id', async (req, res) => {

  try {
    const id = Number(req.params.id);

    const movie = await prisma.movies.findUnique({ // Verifica se o filme existe no banco de dados
      where: { id }
    });

    if (!movie) {
      return res.status(404).send({ message: 'Filme não encontrado.' });
    }

    const data = { ...req.body }; // Obtém os dados do corpo da requisição
    data.release_date = data.release_date ? new Date(data.release_date) : undefined;

    await prisma.movies.update({ // Atualiza um filme no banco de dados UPDATE
      where: { id }, // Atualiza o filme com o ID fornecido na URL
      data: data // Dados a serem atualizados
    });
  } catch (error) {
    return res.status(500).send({ error: 'Erro ao atualizar o filme.' });
  }

  res.status(200).send('Dados atualizados com sucesso!!!');

});

// DELETAR UM FILME EXISTENTE
app.delete('/movies/:id', async (req, res) => {

  try {
    const id = Number(req.params.id);

    const movie = await prisma.movies.findUnique({ // Verifica se o filme existe no banco de dados
      where: { id }
    });

    if (!movie) {
      return res.status(404).send({ message: 'Filme não encontrado.' });
    }

    await prisma.movies.delete({ where: { id } }); // Deleta um filme do banco de dados DELETE 

  } catch (error) {
    return res.status(500).send({ error: 'Erro ao deletar o filme.' });
  }
  res.status(200).send({ message: 'Filme deletado com sucesso!' });

});


// FILTRO POR GÊNERO
app.get('/movies/:genreName', async (req, res) => {
  const genreName = req.params.genreName;

  try{
    const moviesFilteredByGenre = await prisma.movies.findMany({
    include: { // Inclui as relações com os gêneros e idiomas
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

  res.status(200).send(moviesFilteredByGenre);
  
  } catch (error) {
    return res.status(500).send({ error: 'Erro ao filtrar os filmes por gênero.' });
  }
});
 

app.listen(port, () => {
  console.log(`Servidor rodando na porta http://localhost:${port}`);
});