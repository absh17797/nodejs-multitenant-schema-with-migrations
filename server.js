const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const tenantMiddleware = require('./config/tenantMiddleware');
const vehicleRoutes = require('./routes/vehicleRoutes');
require('dotenv').config();


const jwt = require('jsonwebtoken');
const authMiddleware = require('./config/authMiddleware');
const secureRoutes = require('./routes/securedRoutes');

const app = express();
app.use(express.json());
app.use(morgan('dev'));

app.post('/login', (req, res) => {
  const { userId, tenantId } = req.body;
  if (!userId || !tenantId) {
    return res.status(400).json({ message: 'Missing credentials' });
  }
  const token = jwt.sign({ userId, tenantId }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

app.use(tenantMiddleware);

app.use('/api', authMiddleware, secureRoutes);

app.use('/api/vehicles', vehicleRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));