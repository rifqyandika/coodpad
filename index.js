const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const morgan = require("morgan");
const cors = require("cors");

// const connectDB = require('./config/database')

// connectDB()
const PORT = process.env.PORT || 5000

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(morgan("dev"));
app.use(cors());


// router
app.use(require('./routes'))
app.use('/v1', require('./routes/receipe'))



// running the server
app.listen(PORT, () => {
    console.log(`🚀 Server Running on port ${PORT}`)
})