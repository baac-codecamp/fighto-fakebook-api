const express = require('express')
const router = express.Router()
const postController   = require('../controllers/postController')

//GET localhost:3000/api/post
router.get('/', postController.index)
//GET localhost:3000/api/post/xxxxxxxxxxx
router.get('/:id', postController.getPostById)
router.get('/tag/:id', postController.getTags)
router.get('/comment/:id', postController.getComments)
//POST localhost:3000/api/post  {BODY}
router.post('/', postController.createPost)
//PUT localhost:3000/api/post/xxxxxxxxxxxx {BODY}
router.put('/:id', postController.updatePost)
//PATCH localhost:3000/api/post/xxxxxxxxxxxx {BODY}
router.patch('/:id', postController.updatePostSome)
// DELETED localhost:3000/api/post/xxxxxxxxxxxx
router.delete('/:id', postController.deletePost)

module.exports = router
