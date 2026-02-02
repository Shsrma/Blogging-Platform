const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createComment,
  getPostComments,
  updateComment,
  deleteComment,
  likeComment
} = require('../controllers/commentController');

router.post('/post/:postId', authMiddleware, createComment);
router.get('/post/:postId', getPostComments);
router.put('/:id', authMiddleware, updateComment);
router.delete('/:id', authMiddleware, deleteComment);
router.post('/:id/like', authMiddleware, likeComment);

module.exports = router;
