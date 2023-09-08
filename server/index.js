const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 3001;
const productsRoutes = require('./routes/products');
 
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", productsRoutes);
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});