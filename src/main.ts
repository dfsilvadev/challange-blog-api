import cors from 'cors';
import express from 'express';
import routes from './app/routes/router';
/**
 * Import configurations
 * Port, Node Environment, and Database URL
 */
const app = express();

/**
 * Config Response
 * JSON
 */
app.use(express.json());

/**
 * CORS
 */
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));

/**
 * Routes
 */
app.use(routes);

export default app;
