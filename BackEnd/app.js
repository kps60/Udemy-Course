import express from 'express';
import bodyParser from 'body-parser';
import cors from "cors"
import fs from "fs"
import dotenv from "dotenv"
import mongoose from 'mongoose';
import HttpError from './routes/Modals/http-error.js';


import placesRoutes from "./routes/places-routes.js"
import userRoutes from "./routes/users-routes.js"
import path from 'path';


const app = express();
dotenv.config()
app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use('/uploads/images',express.static(path.join('uploads','images')))
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH');
    next()
})
// app.use(cors())

app.use('/api/places', placesRoutes);
app.use('/api/users', userRoutes);

app.use((req, res, next) => {
    const error = new HttpError('could not find this router.', 404);
    throw (error)
})

app.use((error, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, err => {
            console.log(err)
        })
    }
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'an unknown error occured' })
});
const PORT = process.env.PORT || 5000;

const DATABASE_URL = process.env.CONNECTION_URL

mongoose.set('strictQuery', true);
mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => { console.log(`server running on the port ${PORT}`) }))
    .catch((err) => console.log(err.message))