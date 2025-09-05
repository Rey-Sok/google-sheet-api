import express from 'express';
import 'dotenv/config';
import router from './routes/sheetRoute.route.js';


const app = express();
// Use the PORT environment variable if available, otherwise default to 3000
const port = process.env.PORT || 3000;

// Use the API router to handle all incoming requests
app.use('/api', router);

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server running at port: ${port}`);
});