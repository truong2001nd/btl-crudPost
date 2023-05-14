require('dotenv').config()
const express = require('express')

const authRoutes = require('./routes/auth')
const postRoutes = require('./routes/post')
const mongoose = require('mongoose')

const app = express()
app.use(express.json())

const connectDB = async() => {
    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@app.oumel0v.mongodb.net/?retryWrites=true&w=majority`, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        )

        console.log('MongoDB connected')
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}

connectDB()

app.use('/api/auth/', authRoutes)
app.use('/api/post/', postRoutes)

const POST = 5000

app.listen(POST, () => console.log(`Server started on port ${POST}`))