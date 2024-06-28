require('dotenv').config();
const express = require('express');
const connectMongoDB = require('./config/db');
const cors = require('cors')
const todoRoutes = require ('./routes/todo');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());


//mongodb://url:port/?useername={}?password{}/dbname
//const PORT = 8000;
//const connectionString = "mongodb://localhost:27017/todoapp"
// mongoose.connect(connectionString)
//     .then(() => console.log("Successfully connected to MongoDB"))
//     .catch((err) => console.error(`Error connecting to MongoDB: ${err}`))

const PORT = process.env.PORT || 8000;
// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log("Successfully connected to MongoDB"))
//     .catch((err) => console.error(`Error connecting to MongoDB: ${err}`))


//Establish the connection
connectMongoDB();

//cors
app.use(cors ({
    origin : [
        "http://localhost:3000"
    ],
    credentials: true
}))

//Routes
app.use('/api/todo', todoRoutes)
app.use('/api', authRoutes);

app.listen(PORT, () => {
    console.log(`Todo app server is listening on port ${PORT}`)
})