const {Router} = require('express')
const router = Router()
const postsController = require('./controllers')


// /api/admin/posts

router.get('/', postsController.all)
router.get('/:id', postsController.findById)
router.post('/', require('../../middleware/loadFiles'), postsController.create)
router.put('/:id', require('../../middleware/loadFiles'), postsController.update)
router.delete('/:id', postsController.delete)



module.exports = router