require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const recipesRouter = require('./routes/recipes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/recipes', recipesRouter);

app.get('/', (req, res) => res.json({ ok: true, message: 'Recipe API running' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
