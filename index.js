const express = require("express")
const axios = require("axios")
const app = express()
const dotenv = require("dotenv")
const cors = require("cors")
const { travelingSalesman } = require("./travelingSalesman")
const connectDB = require("./config/connection")
const TSPResult = require("./models/tspResult")

app.use(express.json())
app.use(cors())
dotenv.config({ path: "./.env" })

connectDB()

const TOKEN = process.env.MAPBOX_TOKEN

app.post("/api/coordinates", async (req, res) => {
   const { coordinates, profile, names, priority } = req.body
   if (!coordinates || !Array.isArray(coordinates)) {
      return res.status(400).json({ error: "Invalid coordinates data" })
   }
   const allowedProfiles = ["driving", "cycling", "walking", "driving-traffic"]
   if (!allowedProfiles.includes(profile)) {
      return res.status(400).json({ error: "Invalid profile value" })
   }
   // console.log(coordinates)
   // console.log(profile)
   // console.log(TOKEN)
   const extractCoordinates = coordinates
      .map((coord) => `${coord[0]},${coord[1]}`)
      .join(";")
   const mapbox_response = await axios.get(
      `https://api.mapbox.com/directions-matrix/v1/mapbox/${profile}/${extractCoordinates}?annotations=distance,duration&access_token=${TOKEN}`,
   )
   // console.log(mapbox_response.data)

   const solution = travelingSalesman(
      mapbox_response.data.distances,
      mapbox_response.data.durations,
      priority === "distance",
   )

   try {
      const tspRecord = new TSPResult({
         solution,
         names,
         profile,
         priority,
         coordinates,
      })
      var savedRecord = await tspRecord.save()
      console.log(savedRecord)
      res.status(200).json({
         solution: savedRecord.solution,
         names: savedRecord.names,
         profile: savedRecord.profile,
         priority: savedRecord.priority,
         coordinates: savedRecord.coordinates,
      })
   } catch (err) {
      console.log(err)
      res.status(500).json({ message: "Error saving TSP result", error: err })
   }
})

app.get("/api/history", async (_req, res) => {
   try {
      const records = await TSPResult.find()
      res.status(200).json(records)
   } catch (err) {
      console.error(err)
      res.status(500).json({
         message: "Error fetching TSP records",
         error: err,
      })
   }
})

app.get("/api/travel", async (req, res) => {
   const { id } = req.query;
    try {
       const record = await TSPResult.findById(id) // Find the record by id
       if (!record) {
          return res.status(404).json({ message: "Record not found" })
       }
       res.status(200).json(record)
    } catch (err) {
       console.error(err)
       res.status(500).json({
          message: "Error fetching TSP record",
          error: err,
       })
    }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`)
})
