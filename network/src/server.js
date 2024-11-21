// server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// Sample endpoint
app.get('/api/message', (req, res) => {
    res.json({ message: 'Hello from the server!' });
});

const port = process.env.PORT || 3030;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
