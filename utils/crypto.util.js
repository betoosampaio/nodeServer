const crypto = require('crypto');

const _algorithm = 'aes-256-ctr';
const _key = process.env.ENCRYPTION_KEY;
const _iv = crypto.randomBytes(16);

encrypt = (text) => {
    let cipher = crypto.createCipheriv(_algorithm, Buffer.from(_key), _iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return _iv.toString('hex') + ':' + encrypted.toString('hex');
};

decrypt = (text) => {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv(_algorithm, Buffer.from(_key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};

module.exports = { encrypt, decrypt };