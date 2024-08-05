const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static HTML files
app.use(express.static(path.join(__dirname, './public')));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/nategaDB')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define the schema
const studentSchema = new mongoose.Schema({
    seating_no: { type: Number, required: true },
    arabic_name: { type: String, required: true },
    total_degree: { type: Number, required: true },
    student_case_desc: { type: String, required: true }
});

// Define the model
const Student = mongoose.model('natega', studentSchema, 'natega'); // Ensure collection name is 'natega'

// Route to render the search form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Route to handle search request
app.post('/search', async (req, res) => {
    const seating_no = parseInt(req.body.seating_no);
    console.log('Searching for seating_no:', seating_no); // Debugging output
    try {
        const student = await Student.findOne({ seating_no: seating_no });
        if (student) {
            console.log('Student found:', student); // Debugging output
        } else {
            console.log('No student found with that seating number.'); // Debugging output
        }
        res.json(student);
    } catch (err) {
        console.error('Error finding student:', err); // Debugging output
        res.status(500).send(err);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
