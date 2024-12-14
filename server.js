const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./src/config/database');
const app = require('./src/app');

// Connect to MongoDB
connectDB();

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
