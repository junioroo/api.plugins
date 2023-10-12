import {describe, it, xit, expect} from "@jest/globals";
import * as fs from "fs";
import ContractsService from "../../src/services/contracts.service";
import Plugin from "../../src/models/plugin";

const service = new ContractsService();
const contractStr = fs.readFileSync(__dirname + '/../contract.sol', 'utf-8')

describe('ContractsService', () => {
  describe('.compile', () => {
    it('compiles', async () => {

      const compiled = await service.compile(contractStr);
      const contract = compiled.contracts['contract.sol'].Contract;

      expect(Object.keys(contract.abi).length).toEqual(2);
      expect(contract['evm']['bytecode']['object'].length).toEqual(320);
    });
  });

  describe('.deploy', () => {
    // this will decrease your balance!
    xit('deploys', async () => {
      const plugin = {
        contract: contractStr,
      } as Plugin;

      const deployed = await service.deploy(plugin);

      expect(deployed.contractAddress.length).toEqual(42);
    })
  });
});
