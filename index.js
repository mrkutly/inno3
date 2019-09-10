require('dotenv').config();
const express = require("express")
const app = express();

const router = require('./routes/index')
const port = process.env.PORT || 3001;
const host = process.env.HOST || '127.0.0.1';
const frontendUrl = process.env.FRONTEND_URL || '*';

app.use(express.json());
app.use((_, res, next) => {
    res.header('Access-Control-Allow-Origin', frontendUrl);
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

app.use(router)

const server = app.listen(port, host, () => {
    const {address, port} = server.address();
    console.log(`Server running at http://${address}:${port}`)   
});
