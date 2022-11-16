const axios = require('axios');
const { Op } = require('sequelize');
const { Videogame, Genre } = require('../db');

require('dotenv').config();
const {
  RAWG_API_KEY
} = process.env;


const getByNameVideogames = async (name) => {
  

  // ---------------- API ---------------
    const fetchedData = await axios.get(`https://api.rawg.io/api/games?search=${name}&key=${RAWG_API_KEY}`);

    const matchedApiVideogames = fetchedData.data.results?.map((videogame) =>{
    return {
      id: videogame.id,
      name: videogame.name,
      image: videogame["background_image"],
      released: videogame.released,
      rating: videogame.rating,
      genre: videogame.genres?.map((genero) => genero.name)
    }
  })

  //  console.log("matchedApiVideogames", matchedApiVideogames);

  const dbVideogames = await Videogame.findAll({
    where: {
      name: {
        [Op.iLike]: `%${name}%`
      }
    },
    include: {
      model: Genre,
      attributes: ["name"],
      through: {
        attributes: [],
      },
    },
  });

  
  // ---------------- DATABASE---------------
  const fetchedDBVideogames = dbVideogames?.map(videogame => {

    return {
      id: videogame.dataValues.id,
      name: videogame.dataValues.name,
      image: videogame.dataValues.image,
      released: videogame.dataValues.released,
      rating: videogame.dataValues.rating,
      genre: videogame.dataValues?.Genres?.map((genero) => genero.name),
      createdInDb: videogame.dataValues.createdInDb
    }
  })
  // console.log("fetchedDBVideogames", fetchedDBVideogames);

  const foundByName = fetchedDBVideogames.concat(matchedApiVideogames)

  // console.log("foundByName", foundByName.length, foundByName);
  
  return foundByName?.length > 15 ? foundByName.slice(0,15) : foundByName;
  
};

module.exports = getByNameVideogames;