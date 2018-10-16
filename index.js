'use strict'

const { MongoClient } = require('mongodb');
const express = require('express');

const dev = process.env.NODE_ENV !== 'production'
const PORT = 3000;
const MONGO_URL = 'mongodb://localhost:27017/test'

console.log(`Connecting to ${MONGO_URL}`);

const server = express();

let db;

const connectAndStart = async () => {
  console.log('start connect db');
  const client = await MongoClient.connect(MONGO_URL, { useNewUrlParser: true });
  db = client.db();
  console.log('end connect db');
  server.listen(PORT)
  console.log(`Listening on ${PORT}`)  
};

const asyncRequestToResultJson = handler => 
  async (req, res) =>
    handler(req)
    .then(result => res.json(result))
    .catch(error => res.status(500).json({ error: error.message }));

server.get('/book1', asyncRequestToResultJson(function(req) {
  return db.collection('Book').find().sort({ createdAt: -1 }).toArray();
}));

server.get('*', (req, res) => {
  res.send('hello world');
    // return handle(req, res)
});

connectAndStart();



