const express = require('express');
const crypto = require('crypto');
const router = express.Router();

// In-memory store for example purposes
const tokens = {};

// Generate a token for a table
router.post('/generate-token', (req, res) => {
    const { tableId } = req.body;
    if (!tableId) {
        return res.status(400).json({ error: 'Table ID is required' });
    }
    const token = crypto.randomBytes(16).toString('hex'); // Generate a unique token
    tokens[token] = tableId; // Store token and tableId
    const qrUrl = `https://dedicated-cutomer-positive.vercel.app/handle-redirect?token=${token}&tableId=${tableId}`;
    res.json({ qrUrl });
});

// Lookup token to get tableId
router.get('/lookup-token', (req, res) => {
    const { token } = req.query;
    const tableId = tokens[token];
    if (tableId) {
        res.json({ tableId });
    } else {
        res.status(404).json({ error: 'Token not found' });
    }
});

module.exports = router;
