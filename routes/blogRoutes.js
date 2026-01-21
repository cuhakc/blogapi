const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

router.post('/', async (req, res) => {
  try {
    const { title, body, author } = req.body;

    if (!title || !body) {
      return res.status(400).json({ error: 'Title and Body are required fields.' });
    }

    const newBlog = new Blog({ title, body, author });
    const savedBlog = await newBlog.save();
    
    res.status(201).json(savedBlog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.status(200).json(blog);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, body, author } = req.body;
    
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id, 
      { title, body, author }, 
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.status(200).json(updatedBlog);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);

    if (!deletedBlog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.status(200).json({ message: 'Blog post deleted successfully' });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;