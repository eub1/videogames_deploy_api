const axios = require('axios');
const { Videogame, Genre, Platform } = require('../db');
require('dotenv').config();
const {
  RAWG_API_KEY
} = process.env;


const createVideogame = async (name, image, description, released, rating, platforms, genres, createdInDb) => {

  const formVideogame = await Videogame.create({name, image, description, released, rating, platforms, createdInDb});

  //jointTable GENRES
  const foundGenres = await Genre.findAll({
    where:{
      name: genres
    }
  })
 
  await formVideogame.addGenres(foundGenres);

  const newVideogame = await Videogame.findOne({
    where: {
      name: name,
    },
    include: {
      model: Genre,
      attributes: ["name"],
      through: {
        attributes: [],
      },
    },
  })
  
  console.log(newVideogame.toJSON(), "soy el nuevo videojuego creado en controller createVideogame");
  return newVideogame;

};


module.exports = createVideogame;