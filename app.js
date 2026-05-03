const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// 1. Middleware to handle data sent from Login forms
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Serve static files (Images, CSS, JS) from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// 3. ROUTE: Home/Landing Page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 4. ROUTE: Login Page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// 5. API: Handle Login Data
app.post('/api/login', (req, res) => {
    const { buildId, password } = req.body;
    console.log(`Login attempt - Build ID: ${buildId}`);
    
    // For now, redirect to a dashboard or send a success message
    res.send('<h1>Login Successful</h1><p>Welcome to Payzcode AI Dashboard. Coming Soon!</p>');
});

app.listen(port, () => {
    console.log('🚀 Payzcode AI Backend is fully operational on port', port);
});
