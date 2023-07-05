const express = require('express');
const client = require('./utils')

const PORT = 3000;
const HOST = '0.0.0.0';

const app = express();
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

//POST
app.post('/identify', async (req, res) => {
  const { phoneNumber, email } = req.body;
  client.query("SELECT * FROM contacts WHERE email='" + email + "' OR phonenumber='" + phoneNumber + "'", (error, results) => {
    if (results.rows.length == 0) {
      client.query('INSERT INTO contacts (phonenumber, email, "linkPrecedence") VALUES ($1, $2, $3)', [phoneNumber, email, "primary"], (error) => {
        if (error) {
          throw error
        }

      })
    } else {
        client.query('INSERT INTO contacts ("linkedId", phonenumber, email, "linkPrecedence") VALUES ($1, $2, $3, $4)', [results.rows[0].id, phoneNumber, email, "secondary"], (error, results) => {
          if (error) {
            throw error
          }
        })
    }
  })

  client.query("SELECT * FROM contacts WHERE email='" + email + "' OR phonenumber='" + phoneNumber + "'", (error, results) => {
    let email = []
    let phoneNumbers = []
    let secondaryContactIds = []
    
    results.rows.forEach((element) => {
      if (!email.includes(element.email)) {
        email.push(element.email)
      }
      if (!phoneNumbers.includes(element.phonenumber)) {
        phoneNumbers.push(element.phonenumber)
      }
      if (!secondaryContactIds.includes(element.linkedId)) {
        secondaryContactIds.push(element.linkedId)
      }
    });

    let json = {
      "contact": {
        "primaryContatctId": results.rows[0].id,
        "emails": email, // first element being email of primary contact 
        "phoneNumbers": phoneNumbers, // first element being phoneNumber of primary contact
        "secondaryContactIds": secondaryContactIds // Array of all Contact IDs that are "secondary" to the primary contact
      }
    }
    return res.send(json);
  })
});

