//src/swagger/swaggerDef.js
module.exports = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Swing Notes API',
      version: '1.0.0',
      description: 'API för att hantera anteckningar med JWT'
    },
    servers: [
      { url: 'http://localhost:' + (process.env.PORT || 4000) }
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      },
      schemas: {
        Note: {
          type: 'object',
          properties: {
            id:         { type: 'string', format: 'uuid' },
            title:      { type: 'string', maxLength: 50 },
            text:       { type: 'string', maxLength: 300 },
            createdAt:  { type: 'string', format: 'date-time' },
            modifiedAt: { type: 'string', format: 'date-time' }
          }
        },
        SignupRequest: {
          type: 'object',
          required: ['username','password'],
          properties: {
            username: { type: 'string' },
            password: { type: 'string' }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['username','password'],
          properties: {
            username: { type: 'string' },
            password: { type: 'string' }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: { type: 'string' }
          }
        }
      }
    },
    security: [ { bearerAuth: [] } ]
  },
  apis: [
    './swing-notes-api/src/routes/*.js',
    './swing-notes-api/src/controllers/*.js'
  ]
};

