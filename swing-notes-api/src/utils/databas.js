const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Du kan lägga till ssl eller andra inställningar vid behov
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
