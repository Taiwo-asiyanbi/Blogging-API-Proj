const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const blogController = require('../controllers/blogController');
const { validateBlog, handleValidationErrors } = require('../middleware/validation');

router.post('/', auth, validateBlog, handleValidationErrors, blogController.createBlog);
router.get('/', blogController.getBlogs);
router.get('/:id', blogController.getBlogById);
router.get('/user/me', auth, blogController.getUserBlogs);
router.put('/:id', auth, validateBlog, handleValidationErrors, blogController.updateBlog);
router.patch('/:id/state', auth, handleValidationErrors, blogController.updateState);
router.delete('/:id', auth, blogController.deleteBlog);

module.exports = router;
