const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  student_id: { type: String, unique: true, required: true },
  weekly_self_study_hours: { type: Number, required: true },
  attendance_percentage: { type: Number, required: true },
  class_participation: { type: Number, required: true },
  total_score: { type: Number, required: true },
  grade: { type: String, required: true }
}, {
  timestamps: true
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
