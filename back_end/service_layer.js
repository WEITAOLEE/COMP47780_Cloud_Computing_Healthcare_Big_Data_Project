const express = require('express');
const { Client } = require('pg');
const AWS = require('aws-sdk');

// The credentials obtained from the 'aws sts assume-role' command
const accessKeyId = 'ASIASVHICT7POD4DMJGG';
const secretAccessKey = 'o9sgymUoXRTVQWrXtLRGgTw9uoLd792d36mkNGnH';
const sessionToken = process.env.sessionToken;

const app = express();
const port = 3001; // Directly using the port number

// Configure AWS
AWS.config.update({
  region: 'eu-north-1', // My AWS region
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  sessionToken: sessionToken,
});

// Function to create a Redshift client
function createRedshiftClient() {
  // Create a Redshift client with the obtained credentials
  const redshiftClient = new Client({
    user: 'weitaoli',
    password: 'WeitaoLi22201704',
    database: 'dev', // My Redshift database name
    port: 5439, // Default Redshift port
    host: 'default-workgroup.183022821342.eu-north-1.redshift-serverless.amazonaws.com', // Your Redshift endpoint
    ssl: true
  });
  return redshiftClient;
}

// Helper function to perform a query and return results
function queryRedshift(client, query, res) {
  client.connect(connectErr => {
    if (connectErr) {
      console.error('Redshift Connection Error:', connectErr);
      return res.status(500).send('Error connecting to Redshift');
    }

    client.query(query, (queryErr, queryResult) => {
      if (queryErr) {
        console.error('Query Error:', queryErr);
        return res.status(500).send('Error running the query');
      }

      res.json(queryResult.rows);
      client.end(); // Close the connection
    });
  });
}

// Endpoint for 'country_wise_latest' table
app.get('/country-wise-latest', (req, res) => {
  const client = createRedshiftClient();
  const query = 'SELECT * FROM country_wise_latest LIMIT 100'; // Adjust the LIMIT as needed
  queryRedshift(client, query, res);
});

// Endpoint for 'covid_19_clean_complete' table
app.get('/covid-19-clean-complete', (req, res) => {
  const client = createRedshiftClient();
  const query = 'SELECT * FROM covid_19_clean_complete LIMIT 100'; // Adjust the LIMIT as needed
  queryRedshift(client, query, res);
});

// Endpoint for 'full_grouped' table
app.get('/full-grouped', (req, res) => {
  const client = createRedshiftClient();
  const query = 'SELECT * FROM full_grouped LIMIT 100'; // Adjust the LIMIT as needed
  queryRedshift(client, query, res);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
