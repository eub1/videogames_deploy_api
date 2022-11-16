const axios = require('axios');
const { Genre, Op } = require('../db');
require('dotenv').config();
const {
  RAWG_API_KEY
} = process.env;

 //Obtener todos los tipos de géneros de videojuegos posibles, si no lo encuentra, crearlo
const getOrCreateGenres = async () => {

  const fetchedApiGenres = await axios.get(`https://api.rawg.io/api/genres?key=${RAWG_API_KEY}`);
  const setGenres = new Set()
  fetchedApiGenres.data?.results?.map( g => setGenres.add(g.name))

  const genresNamesArray = [...setGenres].sort()
  
  const promisesArrayCreateFindGenresNames = genresNamesArray.map( genero => 
    Genre.findOrCreate({ where: {name: genero}}))
  
  const arrayFoundCreatedGenres = await Promise.all(promisesArrayCreateFindGenresNames);
 
  const fetchedDbGenresNames = []
  arrayFoundCreatedGenres.forEach( item => fetchedDbGenresNames.push({id: item[0].dataValues.id, name: item[0].dataValues.name}))
  
  return fetchedDbGenresNames;

};


module.exports = getOrCreateGenres;

/*
console.log(genresNames);
[
  'Action',                'Adventure',
  'Arcade',                'Board Games',
  'Card',                  'Casual',
  'Educational',           'Family',
  'Fighting',              'Indie',
  'Massively Multiplayer', 'Platformer',
  'Puzzle',                'RPG',
  'Racing',                'Shooter',
  'Simulation',            'Sports',
  'Strategy'
]
 */