require('dotenv').config();
process.env.JWT_SECRET ||= 'dev_secret_change_me';
process.env.JWT_EXPIRES_IN ||= '7d';
process.env.MONGO_URI ||= 'mongodb://127.0.0.1:27017/quickbite';
process.env.PORT ||= '5000';
process.env.CLIENT_ORIGIN ||= '*';
