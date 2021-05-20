import app from './index.js';

const port = process.env.PORT || 4000; // port fallback

// start the server
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
