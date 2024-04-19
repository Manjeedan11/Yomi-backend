require('dotenv').config();
const express = require('express');
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const mangaDetailsRoute = require('./routes/mangaDetailsRoute');


connection();

app.use(express.json())
app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use('/manga', mangaDetailsRoute);

const port = process.env.PORT || 5555;
app.listen(port, () => console.log(`Listening on port ${port}`))

app.get('/', (request, response) => {
    console.log(request)
    return response.status(234).send('Welcome to Manga Discovery')
    });