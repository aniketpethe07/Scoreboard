const mongoose = require('mongoose')

const URI = process.env.URI

const connectDB = async () => {
    try {
        await mongoose.connect(URI) 
        console.error(`Database Connection Successful`);
    } catch (error) {
        console.error(`Database Connection Failed`);
        process.exit(0)
    }
}

module.exports = connectDB 