const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection string (replace with your actual connection string if needed)
const uri = 'mongodb+srv://sheikhtanvirsiddiki55:ppp175980@cluster0.5ufyb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(uri)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Student schema and model
const studentSchema = new mongoose.Schema({
  name: String,
  class: String,
  fees: [Boolean],
});

const Student = mongoose.model('Student', studentSchema);

// Routes

// Add a new student
app.post('/students', async (req, res) => {
  const newStudent = new Student(req.body);
  try {
    await newStudent.save();
    res.status(201).send(newStudent);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all students
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).send(students);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a student's info
app.put('/students/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send(updatedStudent);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a student
app.delete('/students/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

