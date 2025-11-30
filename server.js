import express from 'express';
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: './src' });
});
app.get('/login', (req, res) => {
    res.sendFile('login.html', { root: './src' });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});