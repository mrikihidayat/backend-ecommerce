const express = require('express');
const {
    createUser,
    getUsers,
    getUserById,
    deleteUser,
    updateUser,
    countUser,
} = require('../controllers/userController');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/create', authenticate, createUser);
router.post('/', authenticate, getUsers);
router.post('/detail/:id', authenticate, getUserById);
router.post('/update/:id', authenticate, updateUser);
router.post('/delete/:id', authenticate, deleteUser);
router.get('/count', authenticate, countUser);

module.exports = router;
