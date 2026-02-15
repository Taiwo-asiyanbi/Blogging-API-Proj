const Blog = require('../models/blog');
const User = require('../models/user');

const calculateReadingTime = require("../utils/calculateReadingTime");



// Create Blog (Draft by default)
exports.createBlog = async (req, res) => {
  try {
    // calculate reading time from the blog body
     const readingTime = calculateReadingTime(req.body.body);
    const blog = await Blog.create({ ...req.body, author: req.user._id });
    res.status(201).json({ success: true, message: 'Blog created successfully', data: blog });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get All Published Blogs (Public)
exports.getBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, author, orderBy } = req.query;
    const query = { state: 'published' };

    if (search) query.$or = [{ title: new RegExp(search, 'i') }, { tags: new RegExp(search, 'i') }];
    if (author) query.author = author;

    const blogs = await Blog.find(query)
      .populate('author', 'first_name last_name email')
      .sort(orderBy ? { [orderBy]: -1 } : {})
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Blog.countDocuments(query);

    res.json({
      success: true,
      data: blogs,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Single Blog (Public if published, Owner if draft)
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'first_name last_name email');
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });

    if (blog.state === 'published' || blog.author._id.equals(req.user?._id)) {
      blog.read_count += 1;
      await blog.save();
      return res.json({ success: true, data: blog });
    }

    return res.status(403).json({ success: false, message: 'You are not authorized to view this blog' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get User's Own Blogs
exports.getUserBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, state } = req.query;
    const query = { author: req.user._id };
    if (state) query.state = state;

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Blog.countDocuments(query);

    res.json({
      success: true,
      data: blogs,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Blog Content (Owner Only)
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });

    if (!blog.author.equals(req.user._id))
      return res.status(403).json({ success: false, message: 'You are not authorized to update this blog' });

    Object.assign(blog, req.body);
    await blog.save();

    res.json({ success: true, message: 'Blog updated successfully', data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Blog State (Owner Only)
exports.updateState = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });

    if (!blog.author.equals(req.user._id))
      return res.status(403).json({ success: false, message: 'You are not authorized to update this blog' });

    blog.state = req.body.state;
    await blog.save();

    res.json({ success: true, message: `Blog state updated to ${blog.state}`, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete Blog (Owner Only)
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });

    if (!blog.author.equals(req.user._id))
      return res.status(403).json({ success: false, message: 'You are not authorized to delete this blog' });

    await blog.deleteOne();
    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



// 
exports.getBlogs = async (req, res) => {
  try {
    const { author, title, tags } = req.query;
    let filter = { state: "published" };

    // Search by title (case-insensitive)
    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }

    // Search by tags (support multiple comma-separated tags)
    if (tags) {
      const tagArray = tags.split(",").map(tag => tag.trim());
      filter.tags = { $in: tagArray };
    }

    // Search by author name
    if (author) {
      const user = await User.findOne({
        $or: [
          { first_name: { $regex: author, $options: "i" } },
          { last_name: { $regex: author, $options: "i" } }
        ]
      });

      if (user) {
        filter.author = user._id;
      } else {
        return res.status(404).json({ success: false, message: "Author not found" });
      }
    }

    const blogs = await Blog.find(filter).populate("author", "first_name last_name email");
    res.json({ success: true, data: blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
