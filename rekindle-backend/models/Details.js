const mongoose = require('mongoose');

const guardianSchema = new mongoose.Schema({
  name: String,
  relationship: String,
  contact: String,
  photo: {
    data: Buffer,
    contentType: String
  }
}, { _id: false });

const detailsSchema = new mongoose.Schema({
  patientName: String,
  guardians: [guardianSchema],
  familyPhoto: {
    data: Buffer,
    contentType: String
  }
});

module.exports = mongoose.model('Details', detailsSchema); 