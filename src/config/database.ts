// src/config/database.ts
import { Sequelize } from 'sequelize-typescript';
import Product from '../models/uva/producto';
import dotenv from 'dotenv';
import Order from '../models/smartpick/Order';
import Orderitem from '../models/smartpick/OrderItem';
import Orderdep from '../models/smartpick/OrderDep';
import Location from '../models/smartpick/Location';
import LocationLp from '../models/smartpick/LocationLP';


dotenv.config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  models: [Product, Order, Orderitem, Orderdep, Location, LocationLp],
  logging: false,
});

export default sequelize;