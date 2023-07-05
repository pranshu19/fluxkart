const { Pool, Client } = require('pg');

const client = new Client({
  user: 'user',
  host: 'postgres',
  database: 'db',
  password: 'pass',
  port: 5432,
});

client.connect()

const delQuery = 'DROP TABLE contacts'

const query = `CREATE TABLE IF NOT EXISTS "contacts" (
	"id" SERIAL,
	"phonenumber" VARCHAR(50) NOT NULL,
	"email" VARCHAR(100),
  "linkedId"       INTEGER,
  "linkPrecedence" VARCHAR(50),
	"createdAt"      DATE NOT NULL DEFAULT CURRENT_DATE,
	"updatedAt"      DATE NOT NULL DEFAULT CURRENT_DATE,
  "deletedAt"      DATE,
  PRIMARY KEY ("id")
)`;

const newTableFromQuery = async () => {
    await client.query(query);  // sends query
};

newTableFromQuery().then(() => console.table('New table created! if not Exists')).catch(error => console.error(error.stack));
module.exports = client