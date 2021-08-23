const {Router} = require('express')
const router = Router()
const Controller = require('./controllers')

// /api/how

router.get('/', Controller.get)



module.exports = router