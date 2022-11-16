const axios = require('axios');
const { Videogame, Genre, Platform } = require('../db');

require('dotenv').config();
const {
  RAWG_API_KEY
} = process.env;


const getApiVideogames = async () => {

  const api100 = new Set();

  for ( let i = 1; i < 6 ; i++ ) {
    const fetchedData = await axios.get(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&page=${i}`);

    api100.add(fetchedData.data.results);
  };

  // console.log("api100", api100.length, api100, "api100", api100.length);
  const apiVideogames = [...api100].flat()
  // console.log("apiVideogames", apiVideogames.length, apiVideogames, "apiVideogames", apiVideogames.length);
  const apiVideogamesFormatedArray = apiVideogames.map((videogame) =>{
    return {
      id: videogame.id,
      name: videogame.name,
      image: videogame["background_image"],
      released: videogame.released,
      rating: videogame.rating,
      platforms: videogame.platforms?.map( p => p.platform?.name),
      genre: videogame.genres?.map((genero) => genero.name)
    }
  });
  
  //  console.log("apiVideogamesFormatedArray", apiVideogamesFormatedArray.length, apiVideogamesFormatedArray);
  return apiVideogamesFormatedArray;

};

const getDbVideogames = async () => {
  const dbVideogames = await Videogame.findAll({
    // attributes: ['id', 'name', 'released', 'rating'],
      include: {
      model: Genre,
      attributes: ["name"],
      through: {
        attributes: [],
      }
    }
  });

  // console.log("dbVideogames", dbVideogames);
  const fetchedDBVideogames = dbVideogames?.map(el => {
    return {
      id: el.id,
      name: el.name,
      image: el.image,
      released: el.released,
      rating: el.rating,
      platforms: el.platforms?.map((p) => p.name),
      genre: el.Genres?.map((genero) => genero.name),
      createdInDb: el.createdInDb
    }
  })

  // console.log(fetchedDBVideogames, "dbgames");

  return fetchedDBVideogames;
}

const getAllVideogames = async() => {

  const promisesAllVideogames = [getApiVideogames(), getDbVideogames()];
  const arrayOfAllVideogames = await Promise.all(promisesAllVideogames);
  
  const flattenedArray = arrayOfAllVideogames[0].concat(arrayOfAllVideogames[1])
  // console.log("flattenedArray", flattenedArray.length, flattenedArray,"flattenedArray", flattenedArray.length);
    return flattenedArray;
}

module.exports = getAllVideogames;