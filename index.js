import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import dotenv from 'dotenv';
import app from './app/app.js'
// Configuración de __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: './.env' });

const PORT = process.env.SERVER_PORT || 3000;

app.use(cors()); 
app.use(express.json()); 


// Middleware
app.use(express.static(path.join(__dirname,'public')));



app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});