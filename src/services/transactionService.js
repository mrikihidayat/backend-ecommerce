const Transaction = require('../models/transactionModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const mongoose = require('mongoose');
const midtransService = require('./midtransService');

exports.createTransaction = async (data) => {
    const requiredAttributes = [
        'order_id',
        'user_id',
        'product_id',
        'amount',
        'payment_type',
        'bank',
    ];
    const allowedAttributes = [
        ...requiredAttributes,
        'status',
        'description',
    ];
    const missingAttributes = requiredAttributes.filter((key) => !data[key]);
    const extraAttributes = {};

    if (missingAttributes.length > 0) {
        throw new Error(
            `Missing required parameters: ${missingAttributes.join(', ')}. Please provide all required fields.`
        );
    }

    for (const key in data) {
        if (!allowedAttributes.includes(key)) {
            extraAttributes[key] = data[key];
            delete data[key];
        }
    }

    let user;
    if (mongoose.isValidObjectId(data.user_id)) {
        user = await User.findById(data.user_id);
    } else {
        throw new Error(`Invalid user_id: '${data.user_id}' is not a valid ObjectId.`);
    }

    if (!user) {
        throw new Error(
            `User with ID '${data.user_id}' not found. Ensure the provided user_id is correct and exists in the system.`
        );
    }

    if (!Array.isArray(data.product_id) || data.product_id.length === 0) {
        throw new Error(`product_id must be a non-empty array of objects with product_id and quantity.`);
    }

    const products = [];
    let totalAmount = 0;

    for (const item of data.product_id) {
        if (!mongoose.isValidObjectId(item.product_id)) {
            throw new Error(`Invalid product_id: '${item.product_id}' is not a valid ObjectId.`);
        }

        const product = await Product.findById(item.product_id);
        if (!product) {
            throw new Error(
                `Product with ID '${item.product_id}' not found. Verify the provided product_id corresponds to an existing product.`
            );
        }

        const quantity = parseInt(item.quantity, 10) || 1;

        if (product.stock < quantity) {
            throw new Error(
                `Insufficient stock for product ID '${item.product_id}'. Current stock: ${product.stock}, requested: ${quantity}.`
            );
        }

        totalAmount += product.price * quantity;
        product.stock -= quantity;

        products.push({
            product_id: product._id,
            quantity: quantity,
        });
    }

    data.amount = totalAmount;

    const midtransResponse = await midtransService.requestTransaction(
        data.bank,
        data.order_id,
        data.amount
    );

    if (midtransResponse.status_code !== '201') {
        throw new Error(
            `Midtrans transaction failed for order_id '${data.order_id}'. Reason: ${midtransResponse.status_message}. Ensure the payment details are correct and try again.`
        );
    }

    try {
        for (const { product_id } of products) {
            const product = await Product.findById(product_id);
            await product.save();
        }
    } catch (error) {
        throw new Error(
            `Failed to update product stock. Reason: ${error.message}. Check the database connection and product schema.`
        );
    }

    data.product_id = products;

    const transaction = new Transaction({ ...data, extraAttributes });

    try {
        await transaction.save();
    } catch (error) {
        throw new Error(
            `Failed to save transaction for order_id '${data.order_id}' to the database. Reason: ${error.message}. Check the database connection and the transaction schema.`
        );
    }

    return midtransResponse;
};

exports.getAllTransactions = async () => {
    return await Transaction.find()
        .populate('user_id', 'name email phone user_id')
        .populate('product_id.product_id', 'name price category');
};

exports.getTransactionById = async (id) => {
    const transaction = await Transaction.findById(id)
        .populate('user_id', 'name email phone user_id')
        .populate('product_id.product_id', 'name price category');

    if (!transaction) {
        throw new Error(
            `Transaction with ID '${id}' not found. Ensure the provided transaction ID is correct.`
        );
    }
    return transaction;
};

exports.updateTransaction = async (id, data) => {
    const allowedAttributes = [
        'order_id',
        'user_id',
        'product_id',
        'status',
        'payment_type',
        'description',
        'bank',
    ];

    const updates = {};
    const extraUpdates = {};

    for (const key in data) {
        if (allowedAttributes.includes(key) && data[key] !== undefined) {
            updates[key] = data[key];
        } else if (data[key] !== undefined) {
            extraUpdates[key] = data[key];
        }
    }

    const transaction = await Transaction.findById(id);
    if (!transaction) {
        throw new Error(
            `Transaction with ID '${id}' not found. Update operation aborted.`
        );
    }

    if (updates.user_id) {
        let user;
        if (mongoose.isValidObjectId(updates.user_id)) {
            user = await User.findById(updates.user_id);
        } else {
            throw new Error(
                `Invalid user_id: '${updates.user_id}' is not a valid ObjectId.`
            );
        }

        if (!user) {
            throw new Error(
                `User with ID '${updates.user_id}' not found. Ensure the provided user_id is correct and exists in the system.`
            );
        }
        updates.user_id = user._id;
    }

    if (Array.isArray(updates.product_id)) {
        const products = [];
        let newAmount = 0;

        for (const item of updates.product_id) {
            if (!mongoose.isValidObjectId(item.product_id)) {
                throw new Error(`Invalid product_id: '${item.product_id}' is not a valid ObjectId.`);
            }

            const product = await Product.findById(item.product_id);
            if (!product) {
                throw new Error(
                    `Product with ID '${item.product_id}' not found. Ensure the provided product_id corresponds to an existing product.`
                );
            }

            const quantity = parseInt(item.quantity, 10);
            if (isNaN(quantity) || quantity <= 0) {
                throw new Error(
                    `Invalid quantity for product ID '${item.product_id}'. Quantity must be a positive number.`
                );
            }

            newAmount += product.price * quantity;
            products.push({
                product_id: product._id,
                quantity,
            });
        }

        updates.product_id = products;
        updates.amount = newAmount;
    }

    if (Object.keys(extraUpdates).length > 0) {
        Object.assign(transaction.extraAttributes, extraUpdates);
    }

    if (Object.keys(updates).length > 0) {
        Object.assign(transaction, updates);
    }

    try {
        return await transaction.save();
    } catch (error) {
        throw new Error(
            `Failed to update transaction for ID '${id}'. Reason: ${error.message}.`
        );
    }
};

exports.deleteTransaction = async (id) => {
    const transaction = await Transaction.findByIdAndDelete(id);
    if (!transaction) {
        throw new Error(
            `Transaction with ID '${id}' not found. Delete operation aborted.`
        );
    }
    return `Transaction with ID '${id}' deleted successfully.`;
};


exports.getTransactionStatus = async (orderId) => {
    try {
        const transaction = await Transaction.findOne({ order_id: orderId })
            .populate('user_id', 'name email phone user_id')
            .populate('product_id', 'name price category');

        if (!transaction) {
            throw new Error(
                `Transaction with order_id '${orderId}' not found. Ensure the provided order_id is correct.`
            );
        }

        const midtransResponse = await midtransService.getTransactionStatus(orderId);
        return midtransResponse;
    } catch (error) {
        throw new Error(
            `Failed to retrieve transaction status for order_id '${orderId}'. Reason: ${error.message}. Verify the order ID and try again.`
        );
    }
};

exports.getSupportedBanks = () => {
    return midtransService.getSupportedBanks();
};
