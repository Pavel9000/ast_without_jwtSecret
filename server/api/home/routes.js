const {Router} = require('express')
const router = Router()
const Controller = require('./controllers')

// /api/home

router.get('/', Controller.get)



module.exports = router