const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection (Apna MongoDB URI yahan dalein)
mongoose.connect('mongodb+srv://drkamran1871_db_user:Dtslcg7owxFWplMe@cluster0.3i7nncp.mongodb.net/?appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected')).catch(err => console.log(err));

// Schema & Model
const ScriptSchema = new mongoose.Schema({
    title: String,
    category: String,
    code: String,
    createdAt: { type: Date, default: Date.now }
});

const Script = mongoose.model('Script', ScriptSchema);

// Admin: Naya code add karne ke liye
app.post('/api/add-script', async (req, res) => {
    try {
        const { title, category, code, adminSecret } = req.body;
        
        // Simple Admin Password Security
        if (adminSecret !== 'kamran123') {
            return res.status(401).json({ error: 'Unauthorized Admin!' });
        }

        const newScript = new Script({ title, category, code });
        await newScript.save();
        res.status(201).json({ message: 'Script saved successfully to MongoDB!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}));

// Public: Sabhi scripts fetch karne ke liye taaki log copy kar saken
app.get('/api/scripts', async (req, res) => {
    try {
        const scripts = await Script.find().sort({ createdAt: -1 });
        res.json(scripts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
