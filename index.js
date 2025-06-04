require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

/**
 * 1) Body‐parser – måste ligga före alla routes
 */
app.use(express.json());

/**
 * 2) Swagger‐setup
 *    Se till att sökvägen är relativt denna fil (d.v.s. src/index.js)
 */
const swaggerDefinition = require('./swing-notes-api/src/swagger/swaggerDef');
const swaggerSpec       = swaggerJsDoc(swaggerDefinition);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * 3) Hälsokoll (valfritt)
 */
app.get('/', (req, res) => {
  res.send('Swing Notes API körs!');
});

/**
 * 4) Routes – rätta sökvägar
 */
const userRoutes = require('./swing-notes-api/src/routes/userRoutes');
const noteRoutes = require('./swing-notes-api/src/routes/noteRoutes');

app.use('/api/user', userRoutes);
app.use('/api/notes', noteRoutes);

/**
 * 5) Global felhanterare – fångar alla next(err)
 */
app.use((err, req, res, next) => {
  console.error(err);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).json({ error: err.message });
});

/**
 * 6) Starta servern – endast EN gång
 */
app.listen(port, () => {
  console.log(`Servern körs på http://localhost:${port}`);
});
