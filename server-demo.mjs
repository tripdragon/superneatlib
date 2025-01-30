
// we use this to mock in a CDN

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5001;

app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));


// Serve static files from 'public' as ES modules
app.use(express.static(path.join(__dirname, "examples")));
//
app.listen(PORT, () => {
  console.log(`Module server running at http://localhost:${PORT}`);
});

app.get('/yo', (req, res) => {
  res.send('Hello tacos!')
})

// sendFile will go here
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/examples/index.html'));
});
app.get('/basic', function(req, res) {
  res.sendFile(path.join(__dirname, '/examples/basic.html'));
});
