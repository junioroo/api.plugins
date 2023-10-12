import Plugin, {STATUS} from "../models/plugin";
import ContractsService from "../services/contracts.service";

export default class PluginsService {
  contractsService: ContractsService;

  constructor() {
    this.contractsService = new ContractsService();
  }

  create = async (plugin: Plugin): Promise<Plugin> => {
    return plugin.save();
  }

  findById = async (id: string): Promise<Plugin> => {
    const plugin = await Plugin.findOne({
      where: {
        id: id
      }
    });

    return plugin;
  }

  deploy = async (plugin: Plugin): Promise<void> => {
    if (plugin.status === STATUS.DEPLOYED) {
      throw new Error('Plugin already deployed');
    }

    const transactionReceipt = await this.contractsService.deploy(plugin);
    plugin.status = STATUS.DEPLOYED;
    plugin.contractAddress = transactionReceipt.contractAddress;

    await plugin.save();
  }
}
