const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv")
const recordsRouter = require("./routes/finance_records")
dotenv.config();

const app = express()

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/api', recordsRouter)


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));