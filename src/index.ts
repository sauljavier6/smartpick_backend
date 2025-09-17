import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./config/database";
import indexRoutes from './routes/index';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

dotenv.config();
const allowedOrigins = process.env.FRONTEND_ORIGINS?.split(',') || [];

const app = express();
app.use(morgan('dev'));

const FRONTEND = "http://192.168.22.103:5173"; 

app.use(cors({
  origin: FRONTEND,
  credentials: true
}));

app.use(express.json());

app.use(cookieParser());

// Agrupador de rutas
app.use('/api', indexRoutes);

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

sequelize.sync({ alter: true }).then(() => {
  console.log("✅ Base de datos conectada");
  app.listen(PORT, '0.0.0.0',() => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}).catch((err: any) => console.error("❌ Error al conectar BD:", err));