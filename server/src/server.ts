import dotenv from 'dotenv'
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import type { Request, Response } from 'express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

app.use(helmet());  // secure the application
app.use(compression());  // compress response bodies
app.use(morgan('combined'));  // log all requests
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;