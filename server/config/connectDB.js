const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        const connection = mongoose.connection

        connection.on('connected',()=>{
            console.log('MongoDB connected')
        })

        connection.on('error',(error)=>{
            console.error('Error connecting to the database: ', error);
        })
    } catch (error) {
        console.error('Error connecting to the database: ', error);
    }
}

module.exports = connectDB;