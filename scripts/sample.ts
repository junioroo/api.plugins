import * as fs from "fs";
import ContractsService from "../src/services/contracts.service";
import {web3, wssweb3} from "../src/web3";

const service = new ContractsService();


async function buildNft(from: string,) {
  const nftSampleContract = fs.readFileSync(__dirname + "/../contracts/SampleNFT.sol", 'utf8');
  const response = await service.compileAndDeployContract(nftSampleContract, from, 'SampleNFT', [from]);

  if (!('transactionReceipt' in response)) {
    console.log('Error deploying NFT', response);
    return;
  }
  const {
    transactionReceipt: nftTransaction,
    contract: nftContract,
  } = response;

  return {nftTransaction, nftContract};
}

async function buildPlugin(from: string, tokenId: number) {
  const treeDonationContract = fs.readFileSync(__dirname + "/../contracts/TreeDonationPlugin.sol", 'utf8');
  const response = await service.compileAndDeployContract(treeDonationContract, from, 'TreeDonationPlugin', [from, tokenId]);

  if (!('transactionReceipt' in response)) {
    console.log('Error deploying Plugin', response);
    return;
  }

  const {
    transactionReceipt: treeDonationTransaction,
    contract: pluginContract,
    abi,
  } = response;

  return {treeDonationTransaction, pluginContract, pluginAbi: abi};
}

async function attachPlugin(nftContract: any, treeDonationTransaction: any, from: string, tokenId: number) {
  //@ts-ignore
  const attachment = await nftContract.methods.attachPlugin(treeDonationTransaction.contractAddress, tokenId).send(
    //@ts-ignore
    {from: from, to: from,}
  );
  console.log('Attachment', attachment.transactionHash);
}

async function transferNFT(nftContract: any, from: string, to: string, tokenId: number) {
  const nonce = await web3.eth.getTransactionCount(from);

  const transfer = await nftContract.methods.transferNFT(to, tokenId).send(
    {
      nonce: nonce,
      from: from,
      to: to
    }
  );

  console.log('Transfer', transfer.transactionHash);
  console.log('Transfer logs', transfer.logs);
}

async function mintNFT(nftContract: any, from: string, to: string, tokenId: number) {
  const nonce = await web3.eth.getTransactionCount(from);

  const mint = await nftContract.methods.mintNFT(to, tokenId).send(
    {
      nonce: nonce,
      from: from,
      to: to
    }
  );
  console.log('Mint', mint.transactionHash);
}


const deploy = async () => {
  console.log('Deploying sample..');

  const accounts = await web3.eth.getAccounts();
  console.log('Accounts', accounts.length);
  const nftCreator = accounts[0];
  const nftMinter = accounts[1];
  const nftReceiver = accounts[2];
  const tokenId = 3;

  console.log(JSON.stringify({nftCreator, nftMinter, nftReceiver}));

  const {nftTransaction, nftContract} = await buildNft(nftCreator);
  if (!nftTransaction.contractAddress) {
    console.log('Error deploying NFT');
    return;
  }

  const {treeDonationTransaction, pluginContract, pluginAbi} = await buildPlugin(nftCreator, tokenId);
  if (!treeDonationTransaction.contractAddress) {
    console.log('Error deploying Plugin');
    return;
  }
  await attachPlugin(nftContract, treeDonationTransaction, nftCreator, tokenId);
  service.listenTransferEvents(treeDonationTransaction.contractAddress, pluginAbi);

  await mintNFT(nftContract, nftCreator, nftMinter, tokenId);
  await transferNFT(nftContract, nftMinter, nftReceiver, tokenId);
}

deploy().then(() => {
  console.log('done')
});
