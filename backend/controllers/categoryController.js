const { Category, Post } = require("../models");

const categoryController = {
    /**
     * Fetches all categories.
     *
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<void>} - A promise that resolves when the categories are fetched.
     */
    getCategories: async (req, res) => {
        try {
            const categories = await Category.findAll();
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(categories));
        } catch (error) {
            console.error('Error fetching categories:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Something went wrong' }));
        }
    },

    /**
     * Fetches a category by ID.
     *
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {number} id - The ID of the category to fetch.
     * @returns {Promise<void>} - A promise that resolves when the category is fetched.
     */
    getCategory: async (req, res, id) => {
        try {
            const category = await Category.findByPk(id);
            if (category) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(category));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Category not found' }));
            }
        } catch (error) {
            console.error('Error fetching category:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Something went wrong' }));
        }
    }
};

module.exports = categoryController;
