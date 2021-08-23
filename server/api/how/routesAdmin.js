const {Router} = require('express')
const router = Router()
const Controller = require('./controllers')


// /api/admin/how

router.get('/', Controller.get)
router.put('/', require('../../middleware/loadFiles'), Controller.update)



module.exports = router