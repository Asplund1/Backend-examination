// src/index.js
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDefinition = require('./swagger/swaggerDef');

const swaggerSpec = swaggerJsDoc(swaggerDefinition);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.send('Swing Notes API körs!');
});

app.listen(port, () => {
  console.log(`Servern lyssnar på http://localhost:${port}`);
});
require('dotenv').config();
const express = require('express');

// Middlewares
app.use(express.json());

// Routes
const userRoutes = require('./routes/userRoutes');
const noteRoutes = require('./routes/noteRoutes');

app.use('/api/user', userRoutes);
app.use('/api/notes', noteRoutes);

// Global error-handler (enkel version)
app.use((err, req, res, next) => {
  console.error(err);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).json({ error: err.message });
});

// Starta servern
app.listen(port, () => {
  console.log(`Server körs på http://localhost:${port}`);
});
