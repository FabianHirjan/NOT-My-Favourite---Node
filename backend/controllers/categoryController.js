const { Category } = require("../models");
const { handleRequestBody } = require("../utils");

const categoryController = {
    getCategories: async (req, res) => {
        try {
            const categories = await Category.findAll();
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(categories));
        } catch (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: 'Something went wrong' }));
        }
    },

    getCategory: async (req, res, id) => {
        try {
            const category = await Category.findByPk(id);
            if (category) {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(category));
            } else {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: 'Category not found' }));
            }
        } catch (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: 'Something went wrong' }));
        }
    },

    createCategory: async (req, res) => {
        try {
            const { name } = await handleRequestBody(req);
            const category = await Category.create({ name });
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify(category));
        } catch (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: 'Something went wrong' }));
        }
    },

    updateCategory: async (req, res, id) => {
        try {
            const { name } = await handleRequestBody(req);
            const category = await Category.findByPk(id);

            if (category) {
                category.name = name;
                await category.save();
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(category));
            } else {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: 'Category not found' }));
            }
        } catch (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: 'Something went wrong' }));
        }
    },

    deleteCategory: async (req, res, id) => {
        try {
            const category = await Category.findByPk(id);
            if (category) {
                await category.destroy();
                res.writeHead(204);
                res.end();
            } else {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: 'Category not found' }));
            }
        } catch (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: 'Something went wrong' }));
        }
    }
};

module.exports = categoryController;
