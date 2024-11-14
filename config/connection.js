const mongoose = require("mongoose")

const dbURI =
   "mongodb+srv://pranavsingh469:Simran1911@cluster0.r1t3hsy.mongodb.net/" // Change this to your actual DB URI

// Connect to MongoDB
const connectDB = async () => {
   try {
      await mongoose.connect(dbURI)
      console.log("MongoDB connected successfully")
   } catch (err) {
      console.error("Error connecting to MongoDB:", err.message)
      process.exit(1) // Exit process with failure
   }
}

module.exports = connectDB
