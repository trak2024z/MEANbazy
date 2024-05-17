const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./authRoutes');

// Konfiguracja środowiska
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware do parsowania JSON
app.use(express.json());

// Middleware do obsługi CORS
app.use(cors());

// Routingi dla autentykacji
app.use('/api/auth', authRoutes);

// Globalny middleware do obsługi błędów
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something went wrong!' });
});

// Nasłuchiwanie na określonym porcie
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
