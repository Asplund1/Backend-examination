// swing-notes-api/src/swagger/swaggerDef.js
module.exports = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Swing Notes API',
      version: '1.0.0',
      description: 'API för att spara och hantera anteckningar med JWT-autentisering'
    },
    servers: [
      { url: 'http://localhost:' + (process.env.PORT || 4000) }
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    }
  },
  // APIsökvägarna måste vara relativ projektroten, t.ex.:
  apis: [
    './swing-notes-api/src/routes/*.js',
    './swing-notes-api/src/controllers/*.js'
  ]
};

