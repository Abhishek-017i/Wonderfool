const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Wonderfool API is running');
});

// app.use('/api/auth', require('./routes/authRoutes'));
// //series route
// app.use('/api/persons', require('./routes/personRoutes'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/series', require('./routes/seriesRoutes'));
app.use("/api/persons", require("./routes/personRoutes"));
app.use("/api/articles", require("./routes/articleRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));
app.use("/api/wishlists", require("./routes/wishlistRoutes"));

app.use('/api/reviews', require('./routes/reviewRoutes'));

