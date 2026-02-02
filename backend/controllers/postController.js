const Post = require('../models/Post');
const Comment = require('../models/Comment');

const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    const totalPosts = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    res.status(200).json({
      success: true,
      posts,
      totalPosts,
      pages: Math.ceil(totalPosts / limit),
      currentPage: Number(page)
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch posts'
    });
  }
};

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate({ path: 'author', select: 'username email' })
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'username email' }
      });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.status(200).json({
      success: true,
      post
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid post ID'
      });
    }
    console.error('Error fetching post:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch post'
    });
  }
};

const createPost = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Post title is required'
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Post content is required'
      });
    }

    if (title.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Title must be at least 3 characters long'
      });
    }

    if (content.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Content must be at least 10 characters long'
      });
    }

    const post = new Post({
      title,
      content,
      category,
      tags: tags || [],
      author: req.user.id
    });

    await post.save();
    await post.populate('author', 'username email');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create post'
    });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, tags } = req.body;

    let post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post'
      });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;
    post.tags = tags || post.tags;

    await post.save();
    await post.populate('author', 'username email');

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      post
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid post ID'
      });
    }
    console.error('Error updating post:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update post'
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }

    await Comment.deleteMany({ post: id });
    await Post.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid post ID'
      });
    }
    console.error('Error deleting post:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete post'
    });
  }
};

const likePost = async (req, res) => {
  try {
    const { id } = req.params;

    let post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const hasLiked = post.likes.includes(req.user.id);

    if (hasLiked) {
      post.likes = post.likes.filter(like => like.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: hasLiked ? 'Like removed' : 'Post liked',
      post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to like post'
    });
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost
};
