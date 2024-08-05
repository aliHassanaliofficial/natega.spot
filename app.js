const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');

// Encode special characters in the password
const uri = 'mongodb+srv://owner_admin:34899%40admin@thanawiaspotdb.wh8huwr.mongodb.net/nategaDB';

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Define the schema
const studentSchema = new mongoose.Schema({
  seating_no: { type: Number, required: true },
  arabic_name: { type: String, required: true },
  total_degree: { type: Number, required: true },
  student_case_desc: { type: String, required: true }
});

const Student = mongoose.model('Student', studentSchema);

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // To serve static files from the "public" directory

// API endpoints (example)
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching students' });
  }
});

app.post('/students', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Error creating student' });
  }
});

app.post('/search', async (req, res) => {
  try {
    const { seating_no } = req.body;
    console.log(`Searching for student with seating_no: ${seating_no}`);
    const student = await Student.findOne({ seating_no });
    console.log(`Search result: ${student}`);
    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (err) {
    console.error('Error searching for student:', err);
    res.status(500).json({ message: 'Error searching for student' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
