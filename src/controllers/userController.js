const result = require('../utils/result');
const {
    createUser,
    getUsers,
    getUserById,
    deleteUser,
    updateUser,
    getUserByEmailOrUsername,
    countUser,
} = require('../services/userService');

exports.createUser = async (req, res) => {
    try {
        const { name, phone, email, username, password } = req.body;

        if (!name || !phone || !email || !username || !password) {
            return res.status(400).json(result(1, 'failed', {
                message: 'Name, phone, email, username, and password are required'
            }));
        }

        const savedUser = await createUser(req.body);
        res.status(201).json(result(0, 'success', savedUser));
    } catch (error) {
        res.status(400).json(result(1, 'failed', { message: error.message }));
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await getUsers();
        res.status(200).json(result(0, 'success', users));
    } catch (error) {
        res.status(500).json(result(1, 'failed', { message: error.message }));
    }
};

exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json(result(1, 'failed', { message: 'User not found' }));
        }
        res.status(200).json(result(0, 'success', user));
    } catch (error) {
        res.status(500).json(result(1, 'failed', { message: error.message }));
    }
};

exports.getUserByUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await getUserByEmailOrUsername(username);
        if (!user) {
            return res.status(404).json(result(1, 'failed', { message: 'User not found' }));
        }
        res.status(200).json(result(0, 'success', user));
    } catch (error) {
        res.status(500).json(result(1, 'failed', { message: error.message }));
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedUser = await updateUser(id, req.body);
        if (!updatedUser) {
            return res.status(404).json(result(1, 'failed', { message: 'User not found' }));
        }
        res.status(200).json(result(0, 'success', updatedUser));
    } catch (error) {
        res.status(500).json(result(1, 'failed', { message: error.message }));
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const message = await deleteUser(id);
        if (!message) {
            return res.status(404).json(result(1, 'failed', { message: 'User not found' }));
        }
        res.status(200).json(result(0, 'success', { message }));
    } catch (error) {
        res.status(500).json(result(1, 'failed', { message: error.message }));
    }
};

exports.countUser = async (req, res) => {
    try {
        const count = await countUser();
        res.status(200).json(result(0, 'success', { count }));
    } catch (error) {
        res.status(500).json(result(1, 'failed', { message: error.message }));
    }
};