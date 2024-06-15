const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const TransactionModels = require('./models/Transaction.js');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const mongoUrl = process.env.MONGO_URL;
if (!mongoUrl) {
  throw new Error('MONGO_URL is not defined in the environment variables');
}

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

app.get('/api/test', (req, res) => {
  try {
    res.json('Welcome to the homepage Kunal!');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/transaction', async (req, res) => {
  try {
    const { name, description, datetime , price} = req.body;
    if (!name || !description || !datetime || !price) {
      return res.status(400).json({ error: 'Invalid request' });
    }
    const transaction = await TransactionModels.create({ name, description, datetime, price });
    res.json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await TransactionModels.find({});
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
