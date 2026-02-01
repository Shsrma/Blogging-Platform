const Comment = require('../models/Comment');
const Post = require('../models/Post');

const createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide comment content'
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const comment = new Comment({
      content,
      author: req.user.id,
      post: postId
    });

    await comment.save();
    await comment.populate('author', 'username email');

    post.comments.push(comment._id);
    await post.save();

    res.status(201).json({
      success: true,
      message: 'Comment created successfully',
      comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create comment'
    });
  }
};

const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const totalComments = await Comment.countDocuments({ post: postId });
    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    res.status(200).json({
      success: true,
      comments,
      totalComments,
      pages: Math.ceil(totalComments / limit),
      currentPage: Number(page)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch comments'
    });
  }
};

const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    let comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this comment'
      });
    }

    comment.content = content || comment.content;
    await comment.save();
    await comment.populate('author', 'username email');

    res.status(200).json({
      success: true,
      message: 'Comment updated successfully',
      comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update comment'
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    const postId = comment.post;
    await Comment.findByIdAndDelete(id);

    await Post.findByIdAndUpdate(
      postId,
      { $pull: { comments: id } }
    );

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete comment'
    });
  }
};

const likeComment = async (req, res) => {
  try {
    const { id } = req.params;

    let comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    const hasLiked = comment.likes.includes(req.user.id);

    if (hasLiked) {
      comment.likes = comment.likes.filter(like => like.toString() !== req.user.id);
    } else {
      comment.likes.push(req.user.id);
    }

    await comment.save();

    res.status(200).json({
      success: true,
      message: hasLiked ? 'Like removed' : 'Comment liked',
      comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to like comment'
    });
  }
};

module.exports = {
  createComment,
  getPostComments,
  updateComment,
  deleteComment,
  likeComment
};
