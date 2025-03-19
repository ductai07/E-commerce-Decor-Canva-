const Category = require('../models/category')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')

// Tạo danh mục mới
const createCategory = asyncHandler(async (req, res) => {
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    if (req.body && req.body.name) {
        req.body.slug = slugify(req.body.name)
    }
    const newCategory = await Category.create(req.body)
    return res.status(200).json({
        success: newCategory ? true : false,
        createdCategory: newCategory ? newCategory : 'Cannot create category'
    })
})

// Lấy một danh mục
const getCategory = asyncHandler(async (req, res) => {
    const { slug } = req.params
    const category = await Category.findOne({ slug })
    return res.status(200).json({
        success: category ? true : false,
        categoryData: category ? category : 'Cannot get category'
    })
})

// Lấy tất cả danh mục
const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find()
    return res.status(200).json({
        success: categories ? true : false,
        categories: categories ? categories : 'Cannot get categories'
    })
})

// Cập nhật danh mục
const updateCategory = asyncHandler(async (req, res) => {
    const { cid } = req.params
    if (req.body && req.body.name) {
        req.body.slug = slugify(req.body.name)
    }
    const updatedCategory = await Category.findByIdAndUpdate(cid, req.body, { new: true })
    return res.status(200).json({
        success: updatedCategory ? true : false,
        updatedCategory: updatedCategory ? updatedCategory : 'Cannot update category'
    })
})

// Xóa danh mục
const deleteCategory = asyncHandler(async (req, res) => {
    const { cid } = req.params
    const deletedCategory = await Category.findByIdAndDelete(cid)
    return res.status(200).json({
        success: deletedCategory ? true : false,
        deletedCategory: deletedCategory ? deletedCategory : 'Cannot delete category'
    })
})

module.exports = {
    createCategory,
    getCategory,
    getCategories,
    updateCategory,
    deleteCategory
} 