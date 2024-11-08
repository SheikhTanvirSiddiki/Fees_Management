const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection string
const uri = 'mongodb+srv://sheikhtanvirsiddiki55:ppp175980@cluster0.5ufyb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const studentSchema = new mongoose.Schema({
  name: String,
  class: String,
  fees: [Boolean],
});

const Student = mongoose.model('Student', studentSchema);

// Routes
app.post('/students', async (req, res) => {
  const newStudent = new Student(req.body);
  await newStudent.save();
  res.send(newStudent);
});

app.get('/students', async (req, res) => {
  const students = await Student.find();
  res.send(students);
});

app.put('/students/:id', async (req, res) => {
  const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(updatedStudent);
});

app.delete('/students/:id', async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.send({ message: 'Student deleted' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
