import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3004;

app.get('/', (req: Request, res: Response) => {
  res.send('Server is running with nodemon! 🚀');
});

app.get('/health', (req: Request, res: Response) => {
  res.status(200).send('OK');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
