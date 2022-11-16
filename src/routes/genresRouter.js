const express = require("express");
// const { Genre } = require("../db");
const getOrCreateGenres = require("../controllers/getOrCreateGenres");

const router = express.Router();


// GET /genres
// OBTENER todos los TIPOS de GENEROS de videojuegos posibles
// Primero: traerlos desde rawg. Luego: guardarlos en nuestra DB para luego ya utilizarlos desde ahi

router.get('/', async (req, res) => {
 try {
   const checkedGenres = await getOrCreateGenres()
   checkedGenres ? res.status(200).send(checkedGenres) : res.status(400).send("Genres not found")
 } catch (error) {
  console.log("Error in route '/genres with getOrCreateGenres");
  res.status(400).send(error.message)
 }
});

module.exports = router;