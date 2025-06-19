const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config()
const {errorHandler} = require('./middleware/errorMiddleware')
const agentRoutes = require('./routes/agentsRoutes');
const warehouseRoutes = require('./routes/warehouseRoutes');
const orderRoutes = require('./routes/orderRoutes')
const allocateRoutes = require('./routes/allocateRoutes');

const cors = require('cors');
const port = process.env.PORT || 5001
const connectDB = require('./config/db')

connectDB()
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}))


app.use('/api/agents', agentRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/allocation', allocateRoutes);

app.use(errorHandler)

app.listen(port, () => console.log(`Server running on port ${port}`));
