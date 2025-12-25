const mongoose = require('mongoose');

const StudentDataSchema = new mongoose.Schema({
  email: String,
  input: Object,
  result: Object,
  created_at: Date
});

module.exports = mongoose.model('student_data', StudentDataSchema,'student_data');
