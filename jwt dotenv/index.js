require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { connectToMongoDB } = require("./connect");
const { restrictToLoggedinUserOnly, checkAuth } = require("./middlewares/auth");
const URL = require("./models/url");
const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");

const app = express();
const PORT = process.env.PORT || 8002;

// Connect to MongoDB
connectToMongoDB(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Middlewares
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // For reading cookies

// Routes
app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/", checkAuth, staticRoute);

// Redirect shortened URL with visit history tracking
app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    { shortId },
    { $push: { visitHistory: { timestamp: Date.now() } } }
  );

  if (entry) {
    res.redirect(entry.redirectURL);
  } else {
    res.status(404).send("Short URL not found");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server started at PORT: ${PORT}`);
  console.log(`Visit http://localhost:${PORT}/ to generate a JWT token.`);
});

// require("dotenv").config();
// const express = require("express");
// const path = require("path");
// const cookieParser = require("cookie-parser");
// const { connectToMongoDB } = require("./connect");
// const { restrictToLoggedinUserOnly, checkAuth } = require("./middlewares/auth");
// const URL = require("./models/url");
// const urlRoute = require("./routes/url");
// const staticRoute = require("./routes/staticRouter");
// const userRoute = require("./routes/user");

// const app = express();
// const PORT = process.env.PORT || 8002;

// // Connect to MongoDB
// connectToMongoDB(process.env.MONGODB_URI)
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.log("Error connecting to MongoDB", err));

// // Set view engine
// app.set("view engine", "ejs");
// app.set("views", path.resolve("./views"));

// // Middlewares
// app.use(express.json()); // Parse JSON bodies
// app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
// app.use(cookieParser()); // For reading cookies

// // Routes
// app.use("/url", restrictToLoggedinUserOnly, urlRoute);
// app.use("/user", userRoute);
// app.use("/", checkAuth, staticRoute);

// // Redirect shortened URL with visit history tracking
// app.get("/url/:shortId", async (req, res) => {
//   const shortId = req.params.shortId;
//   const entry = await URL.findOneAndUpdate(
//     { shortId },
//     { $push: { visitHistory: { timestamp: Date.now() } } }
//   );
//   res.redirect(entry.redirectURL);
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server started at PORT: ${PORT}`);
//   console.log(`Visit http://localhost:${PORT}/ to generate a JWT token.`);
// });
