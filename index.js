'use strict'

const { MongoClient } = require('mongodb');
const express = require('express');

const dev = process.env.NODE_ENV !== 'production'
const PORT = 3000;
const MONGO_URL = 'mongodb://localhost:27017/test'

console.log(`Connecting to ${MONGO_URL}`);

const server = express();

const connectToDb = async () => {
  await MongoClient.connect(MONGO_URL, { useNewUrlParser: true });
};

server.get('*', (req, res) => {
  res.send('hello world');
    // return handle(req, res)
});

connectToDb();

server.listen(PORT)
console.log(`Listening on ${PORT}`)


