const express = require('express')
const todoRouter = express.Router()
const todoController = require('../controllers/todo')
const { authenticate } =require('../middlewares/authMiddleware')

todoRouter.get('/', authenticate, todoController.getAllTodos)

todoRouter.post('/', authenticate, todoController.createTodo)

todoRouter.patch('/:id', authenticate, todoController.updateTodo)

todoRouter.delete('/:id', authenticate, todoController.deleteTodo)

module.exports = todoRouter;
