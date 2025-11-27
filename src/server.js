const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
console.log("🔑 Loaded API Key?", process.env.GEMINI_API_KEY ? "YES" : "NO");

const menuRoutes = require('./routes/menuRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/menu', menuRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));