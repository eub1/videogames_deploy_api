const axios = require('axios');
const { Platform } = require('../db');
require('dotenv').config();
const {
  RAWG_API_KEY
} = process.env;

// nuevo comentario
 //Obtener todos los tipos de géneros de videojuegos posibles, si no lo encuentra, crearlo
const getAllPlatforms = async () => {

  const fetchedApiPlatforms = await axios.get(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}`);
  const apiPlatformsArray = fetchedApiPlatforms.data?.results?.map( (v) => v.platforms).flat()
  
  const arrayOfPlatforms = apiPlatformsArray.map(p => p.platform.name)
  const platformsByName = [...new Set(arrayOfPlatforms)].sort()

  const promisesToCreatePlatforms = platformsByName.map( p => Platform.findOrCreate({ where: {name: p}}))
  
  const arrayFoundCreatedPlatforms = await Promise.all(promisesToCreatePlatforms);
  
  const fetchedDbPlatforms = []
  arrayFoundCreatedPlatforms.forEach( item => fetchedDbPlatforms.push({id: item[0].dataValues.id, name: item[0].dataValues.name}))
  // console.log("fetchedDbPlatforms", fetchedDbPlatforms);
  return fetchedDbPlatforms;

};

module.exports = getAllPlatforms;


/* 
fetchedApiPlatforms [
  'Android',         'Linux',
  'Nintendo Switch', 'PC',
  'PS Vita',         'PlayStation 3',
  'PlayStation 4',   'PlayStation 5',
  'Web',             'Xbox',
  'Xbox 360',        'Xbox One',
  'Xbox Series S/X', 'iOS',
  'macOS'
]
*/