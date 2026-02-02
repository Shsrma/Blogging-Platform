const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost
} = require('../controllers/postController');

router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.post('/', authMiddleware, createPost);
router.put('/:id', authMiddleware, updatePost);
router.delete('/:id', authMiddleware, deletePost);
router.post('/:id/like', authMiddleware, likePost);

module.exports = router;
