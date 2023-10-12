import HDWalletProvider from "@truffle/hdwallet-provider";
import Web3 from "web3";
require('dotenv').config()

const mnemonic = process.env.MNEMONIC;
const infuraKey = process.env.INFURA_KEY;

const providerWSSUrl = `wss://goerli.infura.io/ws/v3/${infuraKey}`;
const webSocketProvider = new Web3.providers.WebsocketProvider(providerWSSUrl);
// @ts-ignore
HDWalletProvider.prototype.on = webSocketProvider.on.bind(webSocketProvider);
const wssProvider = new HDWalletProvider(mnemonic, webSocketProvider);
const wssweb3 = new Web3(wssProvider as any);

const providerUrl = `https://goerli.infura.io/v3/${infuraKey}`;
const provider = new HDWalletProvider(mnemonic, providerUrl);
const web3 = new Web3(provider as any);

export {web3, wssweb3};
