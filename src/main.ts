import sequelize from "./db";
import app from './routes/router';
import ContractsService from "./services/contracts.service";

const PORT = process.env.PORT || 5050;

const contractsService = new ContractsService();

(async () => {
  await sequelize.sync();

  await contractsService.startPlugins();
  console.log('Plugins started');

  app.listen(PORT, () => {
    console.log('Server running', PORT);
  });
})();
