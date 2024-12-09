// server.js
import express from 'express';
import cors from 'cors';
import apiapp from './api.js';

const app = express();

app.use(cors());
app.use(express.json()); // To parse JSON request bodies

app.use("/api", apiapp);

// Sample endpoint
app.get('/message', (req, res) => {
    // ".../message" to test directly in browser
    res.json({ message: 'Hello from the server!' });
});

const port = process.env.PORT || 3030;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.get('/api/updateNode', (req, res) => {
    // ".../message" to test directly in browser
    res.json({ message: 'Updating node' });
});
