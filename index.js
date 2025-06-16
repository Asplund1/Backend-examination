require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


app.use(express.json());

 
const swaggerDefinition = require('./swing-notes-api/src/swagger/swaggerDef');
const swaggerSpec       = swaggerJsDoc(swaggerDefinition);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.get('/', (req, res) => {
  res.send('Swing Notes API körs!');
});


const userRoutes = require('./swing-notes-api/src/routes/userRoutes');
const noteRoutes = require('./swing-notes-api/src/routes/noteRoutes');

app.use('/api/user', userRoutes);
app.use('/api/notes', noteRoutes);

 
app.use((err, req, res, next) => {
  console.error(err);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).json({ error: err.message });
});


app.listen(port, () => {
  console.log(`Servern körs på http://localhost:${port}`);
});
