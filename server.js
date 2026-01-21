require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const blogRoutes = require('./routes/blogRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

app.use('/blogs', blogRoutes); 

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});