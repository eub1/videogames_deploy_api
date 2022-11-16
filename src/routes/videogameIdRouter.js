const express = require("express");
const getVideogamebyId = require('../controllers/getByIdVideogame.js')

const router = express.Router();


// GET /videogame/{idVideogame}:
// OBTENER EL DETALLE DE UN VIDEOJUEGO particular. Solo traer los datos pedidos en la ruta de DETALLE de videojuego
// incluir los generos asociados


router.get('/:id', async (req, res) => {

  try {
    // console.log(req.params);
    const {id} = req.params
    if(!id){ throw new Error(`Please write a videogame Id at the end of the url /videogame/id`)};
  
    const videogameById = await  getVideogamebyId(id)
  
    res.status(200).send(videogameById);
    
  } catch (error) {
    console.log(`Error in route /:id.  ${error.message}`);
    res.status(400).send(error.message);
  }
  });
  
  
  
  module.exports = router;