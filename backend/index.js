const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();


const authRoutes = require('./routes/auth.js');
const userRoutes = require('./routes/user.js'); 

const opportunityRoutes = require('./routes/opportunity.js');
const applicationRoutes = require('./routes/application.js');

const app = express();
const PORT = process.env.PORT || 8080;


const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
    console.error("FATAL ERROR: MONGO_URL is not defined in .env file.");
    process.exit(1);
}

main()
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(err => {
        console.error("MongoDB Connection Error:", err);
        process.exit(1); 
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}


app.use(cors()); 
app.use(express.json()); 

app.use('/api/auth', authRoutes); 
app.use('/api/users', userRoutes); 

app.use('/api/opportunities', opportunityRoutes); 
app.use('/api/applications', applicationRoutes);  
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

