
// we use this to mock in a CDN

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;
import cors from "cors";

// Enable CORS for all origins
app.use(cors());

// app.get('/superneatlib.js', (req, res) => {
//   res.set('Cache-Control', 'public, max-age=86400'); // Cache for 1 day (86400 seconds)
//   res.set('ETag', 'superneatlib'); // Optional: You can add ETag if needed
//   res.sendFile(path.join(__dirname, '/build/superneatlib.js')); // Adjust path to your file
// });

// Serve static files from 'public' as ES modules
app.use(express.static(path.join(__dirname, "build")));

app.listen(PORT, () => {
  console.log(`Module server running at http://localhost:${PORT}`);
});
//
// import path from 'path';
//
// const express = require('express')
// const app = express()
// const port = 3000
//
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
//
// // // Serve static files from 'public' as ES modules
// app.use(express.static(path.join(__dirname, "build")));
//
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })
//
// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })
