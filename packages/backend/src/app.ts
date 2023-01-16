import express from 'express';
import config from './config';
import cors from 'cors';

import todoRoutes from './routes/todo-routes';
import authRoutes from './routes/auth-routes';

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [/^https?:\/\/localhost:\d+$/],
  })
);

app.use('/api/v1/todos', todoRoutes);
app.use('/api/v1/auth', authRoutes);

// Pinged every few seconds to check online status
app.get('/api/v1/ping-connection', (_, res) => {
  res.status(200).json({});
});

app.listen(config.get('PORT'), () => {
  console.log(
    `Example app listening at http://localhost:${config.get('PORT')}`
  );
});
