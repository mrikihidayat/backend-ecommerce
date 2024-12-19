const express = require('express');
const {
    createUser,
    getUsers,
    getUserById,
    getUserByUsername,
    deleteUser,
    updateUser,
    countUser,
} = require('../controllers/userController');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/create', authenticate, createUser);
router.post('/', authenticate, getUsers);
router.post('/detail/:id', authenticate, getUserById);
router.post('/username/:username', authenticate, getUserByUsername);
router.post('/update/:id', authenticate, updateUser);
router.post('/delete/:id', authenticate, deleteUser);
router.get('/count', authenticate, countUser);

module.exports = router;
