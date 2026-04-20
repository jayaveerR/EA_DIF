const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  student_id: { type: String, required: true, unique: true },
  risk_score: { type: Number, required: true },
  anomaly_flag: { type: Boolean, required: true }
}, {
  timestamps: true
});

const Prediction = mongoose.model('Prediction', predictionSchema);
module.exports = Prediction;
