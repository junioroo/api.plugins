import solc from 'solc';
import * as path from "path";
import * as fs from "fs";
import {web3, wssweb3} from "../web3";
import Plugin, {STATUS} from "../models/plugin";


export default class ContractsService {

  deploy = async (plugin: Plugin) => {
    const accounts = await web3.eth.getAccounts();
    const from = accounts[0];
    const tokenId = 1;

    return this.compileAndDeployContract(plugin.contract, from, plugin.name, [from, tokenId]);
  }

  async compileAndDeployContract(contractContent: string, from: string, contractName: string, args: any [] = []) {
    // console.log(contractContent, from);
    const compiled = await this.compile(contractContent);

    if ('errors' in compiled) {
      console.log('Compilation errors', compiled.errors);
      return {contractAddress: undefined};
    }

    const compContract = compiled.contracts['contract.sol'][contractName];

    const abi = compContract.abi;
    const bytecode = compContract['evm']['bytecode']['object'];

    const contract = new web3.eth.Contract(abi);
    const deployTx = contract.deploy({
      data: bytecode,
      // @ts-ignore
      arguments: args
    });

    const gasEstimate = await deployTx.estimateGas();
    console.log(`${contractName} Gas Estimate:`, gasEstimate);

    const deployTransaction = {
      from: from,
      gas: gasEstimate,
      data: deployTx.encodeABI(),
    };

    const transactionReceipt = await web3.eth.sendTransaction(deployTransaction);
    console.log(`Contract ${contractName} deployed to address:`, transactionReceipt.contractAddress);

    return {transactionReceipt, contract, bytecode, abi};
  }

// 689890

  compile = async (contract: string) => {
    const input = {
      language: 'Solidity',
      sources: {
        'contract.sol': {
          content: contract,
        },
      },
      settings: {
        evmVersion: "paris",
        optimizer: {
          enabled: true,
          runs: 200
        },
        outputSelection: {
          '*': {
            '*': ['abi', 'evm.bytecode.object'],
          },
        },
      },
    };

    return JSON.parse(solc.compile(JSON.stringify(input), {import: this.findImports}));
  }

  findImports = (relativePath: string) => {
    let absolutePath = path.resolve(__dirname + '/../../contracts', relativePath);
    if (relativePath.startsWith('@')) {
      absolutePath = path.resolve(__dirname, '../../node_modules', relativePath);
    }

    const source = fs.readFileSync(absolutePath, 'utf8');
    return {contents: source};
  }

  listenTransferEvents = (nftContractAddress: string, pluginAbi: any, metadata: any) => {
    const contract = new wssweb3.eth.Contract(pluginAbi, nftContractAddress);
    const event = contract.events['NFTTransferred'];

    if (!event) {
      console.log('event > Error listening to events');
      return;
    }

    // @ts-ignore
    event().on('data', (event: any) => {
      console.log('event > Transfer data', event);

      if ('onTransfer' in metadata) {
        // TODO: fix security issues
        eval(metadata.onTransfer);
      }
    });
  }
  listDeployedPlugins = async (): Promise<Plugin[]> => {
    const plugins = await Plugin.findAll({
      where: {
        status: STATUS.DEPLOYED
      }
    });

    return plugins;
  }

  startPlugins = async () => {
    const plugins = await this.listDeployedPlugins();
    console.log(`Starting ${plugins.length} plugins listeners..`);

    for (const plugin of plugins) {
      this.listenTransferEvents(plugin.contractAddress, plugin.contractAbi, plugin.metadata);
    }
  }
}
