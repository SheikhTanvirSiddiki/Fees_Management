const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from a .env file if present

const app = express();
app.use(express.json());

// Setup CORS to allow requests from your Vercel frontend
app.use(cors({
  origin: 'https://feesmanagement-indol.vercel.app', // Replace with your Vercel URL
  optionsSuccessStatus: 200
}));

// MongoDB connection using environment variable
const uri = process.env.MONGO_URI; // Make sure you set this variable in Vercel environment
mongoose.connect(uri)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Student schema and model
const studentSchema = new mongoose.Schema({
  name: String,
  class: String,
  fees: [Boolean], // Boolean array to track fee payment for 12 months
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

