const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Member'], default: 'Member' },
  status: { type: String, enum: ['Active', 'Pending', 'Rejected'], default: 'Active' },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  profilePicture: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
