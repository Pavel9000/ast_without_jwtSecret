const {Router} = require('express')
const router = Router()
const authController = require('./controllers')

// /api/auth

const bodyParser = require('body-parser')
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

router.post('/register', authController.register)
router.post('/login', authController.login)

module.exports = router