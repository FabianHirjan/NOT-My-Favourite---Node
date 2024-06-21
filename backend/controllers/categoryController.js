const { Category, Post} = require("../models");

const categoryController = {
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
    },

    createCategory: async (req, res) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            try {
                const { name } = JSON.parse(body);
                const category = await Category.create({ name });
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(category));
            } catch (error) {
                console.error('Error creating category:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Something went wrong' }));
            }
        });
    },

    updateCategory: async (req, res, id) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            try {
                const category = await Category.findByPk(id);
                if (category) {
                    const { name } = JSON.parse(body);
                    category.name = name;
                    await category.save();
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(category));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Category not found' }));
                }
            } catch (error) {
                console.error('Error updating category:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Something went wrong' }));
            }
        });
    },

    deleteCategory: async (req, res, id) => {
        try {
            const category = await Category.findByPk(id);
            if (category) {
                await category.destroy();
                res.writeHead(204);
                res.end();
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Category not found' }));
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Something went wrong' }));
        }
    },

    getAdminCategories: async (req, res) => {
        try {
            // Adăugați logică pentru a obține categoriile pentru admin, dacă este necesar
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Admin categories' }));
        } catch (error) {
            console.error('Error fetching admin categories:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Something went wrong' }));
        }
    }
};

module.exports = categoryController;
