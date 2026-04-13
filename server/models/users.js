const mongoose = require('mongoose');
const { Schema } = mongoose;

const usersSchema = new Schema({
    userID: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String },
    fullName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], required: true, default: 'user' },

    province: { type: String, default: null },
    city: { type: String, default: null },
    address: { type: String, default: null },
    phoneNumber: { type: String, default: null },

    dob: { type: Date, default: null },
    gender: { type: String, enum: ['male', 'female', 'other'], default: null },

    referralCode: { type: String, unique: true, required: true }
}, { timestamps: true });

const usersModel = mongoose.models.users || mongoose.model('users', usersSchema);
module.exports = usersModel;