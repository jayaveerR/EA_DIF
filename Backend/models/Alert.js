const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  student_id: { type: String, required: true },
  risk_score: { type: Number, required: true },
  status: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
  reason: { type: String },
  timestamp: { type: Date, default: Date.now }
}, {
  timestamps: true
});

const Alert = mongoose.model('Alert', alertSchema);
module.exports = Alert;
