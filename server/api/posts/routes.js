const {Router} = require('express')
const router = Router()
const postsController = require('./controllers')

// /api/posts

router.get('/', postsController.all)
router.get('/:id', postsController.findById)



module.exports = router