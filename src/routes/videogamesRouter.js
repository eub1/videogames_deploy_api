const express = require("express");
const createVideogame = require('../controllers/createVideogame.js');
const getAllVideogames = require('../controllers/getAllVideogames.js');
const getByNameVideogames = require('../controllers/getByNameVideogames.js')

const { Videogame } = require("../db");

const router = express.Router();


// GET /videogames
// OBTENER UN LISTADO DE LOS VIDEOJUEGOS. Solo devolver los datos necesarios para la ruta principal

// GET /videogames/?name="..."  
// OBTENER UN LISTADO, de los 15 primeros videojuegos que contengan la palabra q viene por query. Mostrar mje acorde si no existe ninguno

// la ruta llamar al controlador, el controlador le deja todo listo para que la ruta haga res.send

router.get('/', async(req, res) => {
  try {
    const { name } = req.query;
    // console.log("name", name, typeof name);
    if(name){
        const byNameVideogames = await getByNameVideogames(name);
        // console.log("byNameVideogames", byNameVideogames.length, byNameVideogames);
         res.status(200).send(byNameVideogames);
    } else {
        const videogames = await getAllVideogames();
        // console.log("videogames",videogames.length, videogames,"videogames",videogames.length);
        return res.status(200).send(videogames);
      }
  } catch (error) {
    res.status(404).send(error.message);
  }

});


// POST /videogames
// CREA UN VIDEOJUEGO en la base de datos, //! relacionado a sus generos
// recibe por body los datos recolectados desde el formulario (de la ruta de )

router.post('/', async (req, res) => {
 console.log(req.body);
  const {name, image, description, released, rating, platforms, genres, createdInDb} = req.body

  try {

    if (!name || !description || !platforms.length) {
      return res.status(404).send("Please complete the required fields");
    };
    const createdVideogame = await createVideogame(name, image, description, released, rating, platforms, genres, createdInDb);
    // console.log("createdVideogame in POST '/' ");
    
    res.status(201).send( createdVideogame );

  } catch (error) {
    console.log(`Error in route POST '/'. ${error.message}`);
    res.status(404).send(error.message);
  }
});



module.exports = router;