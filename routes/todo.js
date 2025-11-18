const router = require('express').Router();
const Todo = require('../models/todo');

// List all todos
router.get('/', async (req, res) => {
    const page= req.params.page || 1;
    const limit = req.params.limit || 10;
    const skip = (page - 1) * limit;
    try {
        const todos = await Todo.find().skip(skip).limit(limit);
        const total = await Todo.countDocuments();
        return res.json({ 
            data: todos,
            pagination: {
                page,
                limit,
                total,
                page: Number(page),
                totalPages: Math.ceil(total / limit)}
         });
    } catch (err) {
        return res.json({ error: err.message });
    }
});

// Create a todo
router.post('/create', async (req, res) => {
    try {
        const todo = new Todo({
            title: req.body.title,
            content: req.body.content,
        });
        const savedTodo = await todo.save();
        return res.json({ data: savedTodo });
    } catch (err) {
        return res.json({ error: err.message });
    }
});

// Update/edit a todo
router.put('/:id', async (req, res) => {
    try {
        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            { title: req.body.title, content: req.body.content, completed: req.body.completed },
            { new: true }
        );
        return res.json({ data: updatedTodo });
    } catch (err) {
        return res.json({ error: err.message });
    }
});

// Delete a todo
router.delete('/:id', async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        return res.json({ message: 'Todo deleted successfully' });
    } catch (err) {
        return res.json({ error: err.message });
    }
});

module.exports = router;