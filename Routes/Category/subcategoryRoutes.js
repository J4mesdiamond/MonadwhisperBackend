// subcategories.js
const express = require('express');
const router = express.Router();
const Subcategory = require('../../Schema/Subcategory');
const Category = require('../../Schema/Category');
const { protect } = require('../../Middleware/auth');

// Public routes (no authentication required)
// Get all subcategories by category
router.get('/category/:categoryId', async (req, res) => {
  try {
    const subcategories = await Subcategory.find({
      category: req.params.categoryId
    }).populate('category', 'name');
    
    res.json({
      success: true,
      count: subcategories.length,
      data: subcategories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get single subcategory
router.get('/:id', async (req, res) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id)
      .populate('category', 'name');
    
    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: 'Subcategory not found'
      });
    }
    
    res.json({
      success: true,
      data: subcategory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Protected routes (require authentication)
// Create subcategory
router.post('/', protect, async (req, res) => {
  try {
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const subcategory = await Subcategory.create(req.body);
    res.status(201).json({
      success: true,
      data: subcategory
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Update subcategory
router.put('/:id', protect, async (req, res) => {
  try {
    if (req.body.category) {
      const category = await Category.findById(req.body.category);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }
    }

    const subcategory = await Subcategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('category', 'name');

    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: 'Subcategory not found'
      });
    }

    res.json({
      success: true,
      data: subcategory
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Delete subcategory
router.delete('/:id', protect, async (req, res) => {
  try {
    const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: 'Subcategory not found'
      });
    }
    res.json({
      success: true,
      message: 'Subcategory deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;