const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('./config/googleAuth');

// Import Routes
const userRoutes = require('./routes/userRoutes');
const emailRoutes = require('./routes/emailRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const cartRoutes = require('./routes/cartRoutes');
const geolocationRoutes = require('./routes/geolocationRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const shippingRoutes = require('./routes/shippingRoutes');
const brandRoutes = require('./routes/brandRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();

// Middleware Setup
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use(
    session({
        secret: process.env.SESSION_SECRET || 'defaultsecret',
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000,
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

// Route Setup
app.use('/api/users', userRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/geolocation', geolocationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/shippings', shippingRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/categories', categoryRoutes);

// Error Handler
app.use((err, req, res, next) => {
    res.status(500).json({ success: false, message: err.message });
});

module.exports = app;
