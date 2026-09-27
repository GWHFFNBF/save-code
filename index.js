const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Apna MongoDB URI yahan dalein
const MONGO_URI = 'mongodb+srv://drkamran1871_db_user:Dtslcg7owxFWplMe@cluster0.3i7nncp.mongodb.net/?appName=Cluster0';

let isConnected = false;
async function connectDB() {
    if (isConnected) return;
    try {
        await mongoose.connect(MONGO_URI);
        isConnected = true;
    } catch (err) {
        console.error('MongoDB Connection Error:', err);
    }
}

const ScriptSchema = new mongoose.Schema({
    title: String,
    category: String,
    code: String,
    createdAt: { type: Date, default: Date.now }
});

const Script = mongoose.models.Script || mongoose.model('Script', ScriptSchema);

// API Routes
app.post('/api/add-script', async (req, res) => {
    await connectDB();
    try {
        const { title, category, code, adminSecret } = req.body;
        
        if (adminSecret !== 'kamran123') {
            return res.status(401).json({ error: 'Unauthorized Admin!' });
        }

        const newScript = new Script({ title, category, code });
        await newScript.save();
        res.status(201).json({ message: 'Script saved successfully to MongoDB!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/scripts', async (req, res) => {
    await connectDB();
    try {
        const scripts = await Script.find().sort({ createdAt: -1 });
        res.json(scripts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Serve index.html using your method
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

module.exports = app;
