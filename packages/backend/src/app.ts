import express from 'express';
import config from './config';

import todoRoutes from './routes/todo-routes';

const app = express();

app.use(express.json());

app.use('/api/v1/todos', todoRoutes);

app.listen(config.get('PORT'), () => {
  console.log(
    `Example app listening at http://localhost:${config.get('PORT')}`
  );
});
