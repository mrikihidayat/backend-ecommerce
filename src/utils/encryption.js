const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const SECRET_KEY = (process.env.SECRET_KEY || 'defaultsecretkeydefaultsecretk').padEnd(32, 'x');

const encrypt = (text) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(SECRET_KEY), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return {
        iv: iv.toString('hex'),
        encryptedData: encrypted,
    };
};

const decrypt = (encryptedData, iv) => {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(SECRET_KEY), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

const generateToken = () => {
    return uuidv4().replace(/-/g, '');
};

module.exports = {
    encrypt,
    decrypt,
    generateToken,
};
