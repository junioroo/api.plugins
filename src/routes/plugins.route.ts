import express, {Router} from "express";
import PluginsService from "../services/plugins.service";
import Plugin from "../models/plugin";
import {validatePlugin} from "../validators";

const app = Router();

const service = new PluginsService();

app.get('/:id', async (req: express.Request, res: express.Response) => {
  const {id} = req.params;
  const plugin = await service.findById(id);

  res.json(plugin);
});

app.post('/', async (req: express.Request, res: express.Response) => {
  const data = req.body;
  validatePlugin(data);

  const plugin = await service.create(data as Plugin);

  res.json(plugin);
});

app.post('/:id/deploy', async (req: express.Request, res: express.Response) => {
  const {id} = req.params;
  const plugin = await service.findById(id);

  await service.deploy(plugin);

  res.json(plugin);
});


export default app;
