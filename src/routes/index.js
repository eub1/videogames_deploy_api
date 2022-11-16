const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const getAllPlatforms = require('../controllers/createPlatformDb.js')
const videogamesRouter = require('./videogamesRouter.js')
const genresRouter = require('./genresRouter.js')
const videogameIdRouter = require('./videogameIdRouter.js')


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use('/videogames', videogamesRouter);
router.use('/genres', genresRouter);
router.use('/videogame', videogameIdRouter);


// /home
// router.get('/', (req, res) => {
//  try {
//   res.send("prueba de ruta get")
//  } catch (error) {
//   res.send(error.message)
//  }
// })

// /platforms
router.get('/platforms', async(req, res)=> {
  try {
    const receivedPlatforms = await getAllPlatforms();
    res.status(200).send(receivedPlatforms);
  } catch (error) {
    res.send(error.message)
  }
});


module.exports = router;
