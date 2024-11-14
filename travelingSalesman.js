travelingSalesman = (distance, time, useDistance) => {
   // Dynamically calculate the number of vertices (V)
   const V = distance.length // or time.length, since both matrices will have the same dimensions

   // Store all vertex apart from the source vertex
   let vertex = []
   for (let i = 0; i < V; i++) {
      if (i !== 0) {
         // source is always 0
         vertex.push(i)
      }
   }

   // Store minimum weight (cost) Hamiltonian cycle and the optimal path
   let minPath = Number.MAX_VALUE
   let optimalPath = []

   // Function to calculate the path weight based on the selected matrix (distance or time)
   const calculatePathWeight = (path, matrix) => {
      let currentPathWeight = 0
      let k = 0 // Start from vertex 0
      for (let i = 0; i < path.length; i++) {
         currentPathWeight += matrix[k][path[i]]
         k = path[i]
      }
      currentPathWeight += matrix[k][0] // Return to the source vertex 0
      return currentPathWeight
   }

   // Try all permutations of the vertex array
   do {
      let currentPath = vertex.slice()
      let currentPathWeight = calculatePathWeight(
         currentPath,
         useDistance ? distance : time,
      )

      // If the current path is better, update the minimum path and path weight
      if (currentPathWeight < minPath) {
         minPath = currentPathWeight
         optimalPath = [0, ...currentPath, 0] // Include the source and destination
      }
   } while (findNextPermutation(vertex)) // Get the next permutation of the vertices

   // Now calculate total distance and total time based on the optimal path
   let totalDistance = calculatePathWeight(optimalPath.slice(1, -1), distance) // Exclude source and destination
   let totalTime = calculatePathWeight(optimalPath.slice(1, -1), time) // Exclude source and destination

   // Return the optimal path details (time, distance, and path)
   return {
      minPath: minPath,
      totalTime: totalTime,
      totalDistance: totalDistance,
      optimalPath: optimalPath,
   }
}

// Function to swap the data at two indices in the array
const swap = (data, left, right) => {
   let temp = data[left]
   data[left] = data[right]
   data[right] = temp
   return data
}

// Function to reverse the sub-array from left to right
const reverse = (data, left, right) => {
   while (left < right) {
      let temp = data[left]
      data[left++] = data[right]
      data[right--] = temp
   }
   return data
}

// Function to find the next permutation of the array
const findNextPermutation = (data) => {
   if (data.length <= 1) return false

   let last = data.length - 2

   // Find the longest non-increasing suffix and pivot
   while (last >= 0) {
      if (data[last] < data[last + 1]) break
      last--
   }

   if (last < 0) return false

   let nextGreater = data.length - 1

   // Find the rightmost successor to the pivot
   for (let i = data.length - 1; i > last; i--) {
      if (data[i] > data[last]) {
         nextGreater = i
         break
      }
   }

   // Swap the successor and pivot
   data = swap(data, nextGreater, last)

   // Reverse the suffix
   data = reverse(data, last + 1, data.length - 1)

   return true
}

module.exports = {travelingSalesman}
