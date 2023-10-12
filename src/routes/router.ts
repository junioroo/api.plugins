import pluginsRoute from "./plugins.route";
import express from 'express';

const app = express();
app.use(express.json());

app.use('/plugins', pluginsRoute);


const errorsHandler = (err: any, req: express.Request, res: express.Response, next: express.NextFunction,) => {
  res.status(400);
  res.json({error: err.message});

  next(err);
};

app.use(errorsHandler);
export default app;
