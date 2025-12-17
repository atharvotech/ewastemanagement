import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// allow JSON body parsing
app.use(express.json());
app.use(express.static('public'));

// simple CORS for local testing (adjust for production)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    next();
});

// auth routes
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: './src' });
});
app.get('/login', (req, res) => {
    res.sendFile('login.html', { root: './src' });
});
app.get('/register', (req, res) => {
    res.sendFile('register.html', { root: './src' });
});
app.get('/dashboard', (req, res) => {
    res.sendFile('dashboard.html', { root: './src' });
});

app.get('/admin', (req, res) => {
    res.sendFile('admin.html', { root: './src' });
});

app.get('/about', (req, res) => {
    res.sendFile('about.html', { root: './src' });
});
app.get('/data', (req, res) => {
    res.sendFile('data.html', { root: './src' });
});
app.get('/history', (req, res) => {
    res.sendFile('history.html', { root: './src' });
});

// connect to mongodb and start server
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ewaste';

mongoose.connect(mongoUri, { autoIndex: true })
    .then(() => {
        console.log('Connected to MongoDB');
        try {
            console.log('MongoDB connection details:', { dbName: mongoose.connection.name, hosts: mongoose.connection.hosts || mongoose.connection.host, uri: process.env.MONGODB_URI || mongoUri });
        } catch (e) {
            console.log('Could not read mongoose connection details:', e.message);
        }
        app.listen(port, () => {
            console.log(`Server listening at http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err.message);
        console.log(`Server will still start but auth endpoints will fail until DB is available.`);
        app.listen(port, () => {
            console.log(`Server listening at http://localhost:${port} (DB not connected)`);
        });
    });
