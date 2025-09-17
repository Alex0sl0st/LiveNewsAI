import pkg from "pg";
import { dbConfig } from "../config/database.js";

const { Pool } = pkg;
export const pool = new Pool(dbConfig);
