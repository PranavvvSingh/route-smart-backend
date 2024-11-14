const mongoose = require("mongoose")

const tspSchema = new mongoose.Schema(
   {
      id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Auto-generated unique ID
      solution: {
         totalTime: { type: Number, required: true },
         totalDistance: { type: Number, required: true },
         optimalPath: { type: [Number], required: true },
      },
      names: { type: [String], required: true },
      profile: { type: String, required: true },
      priority: { type: String, required: true },
      coordinates: {
         type: [[Number]],
         required: true,
      },
      createdAt: { type: Date, default: Date.now },
   },
   {
      versionKey: false, // Removes the __v versioning key
   },
)

// Create and export the TSPResult model
const TSPResult = mongoose.model("TSPResult", tspSchema)
module.exports = TSPResult
