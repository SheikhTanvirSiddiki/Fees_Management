// Import necessary packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(express.json());  // to parse JSON requests
app.use(cors());  // Allow all origins by default (change for specific domains in production)

// MongoDB connection using environment variable
const uri = process.env.MONGO_URI; // MongoDB URI from .env file or Vercel env variable

// Connect to MongoDB Atlas
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define a Student schema
const studentSchema = new mongoose.Schema({
  name: String,
  class: String,
  fees: [Boolean], // Array of Booleans to track fee payments for each month (12 months)
});

// Create a Student model
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

// Start the server on a specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
