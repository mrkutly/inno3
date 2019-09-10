require('dotenv').config();
const express = require("express")
const app = express();

const router = require('./routes/index')
const port = process.env.PORT || 3001;
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

app.listen(port, () => console.log(`server running on port ${port}`));
