const cron = require('node-cron');
const { removeExpiredTokens } = require('../services/tokenService');

cron.schedule('0 0 * * *', async () => {
    try {
        await removeExpiredTokens();
        console.log('Expired tokens removed successfully');
    } catch (error) {
        console.error('Error removing expired tokens:', error.message);
    }
});
