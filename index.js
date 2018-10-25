'use strict'

const { MongoClient } = require('mongodb');
const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = 3000;
const MONGO_URL = 'mongodb://localhost:27017/test'

console.log(`Connecting to ${MONGO_URL}`);

const server = express();

let db;

const connectAndStart = async () => {
  console.log('Connect db');
  const client = await MongoClient.connect(MONGO_URL, { useNewUrlParser: true });
  db = client.db();
  await app.prepare();

  server.use((req, res, next) => {
    // Also expose the MongoDB database handle so Next.js can access it.
    req.db = db;
    next();
  });

  server.get('*', (req, res) => {
    return handle(req, res)
  });

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



connectAndStart();



