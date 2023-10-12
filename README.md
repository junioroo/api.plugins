# Pluginer
#### Make your NFTs plugin-able.


### Instructions
1. Rename .env.example to .env
2. Add the environment variables to your .env file
3. Run `npm install`
4. Run `npm run sample` to see a sample of how to use **Pluginer**


### Contracts
#### Plugin.sol
This contract is the base plugin contract that will be used to create plugins. It has the following functions:
- `emit_transfer(address _from, address _to, uint256 _tokenId, bytes _data)` - This function is used to notify that a token has been transferred. It is called by the NFT contract.

#### PluginHolder.sol
This is the base contract that is used to NFTs that can hold plugins. It has the following functions:
- `attachPlugin(address pluginAddress, uint256 tokenId)` - This function is used to attach a plugin to a NFT.
- `detachPlugin(uint256 tokenId)` - This function is used to detach a plugin from a NFT.
- `isPluginAttached(uint256 tokenId)` - This function is used to check if a plugin is attached to a NFT.
- `getAttachedPluginAddress(uint256 tokenId)` - This function is used to get the address of the plugin attached to a NFT.

#### SampleNFT.sol
This is a sample NFT contract that inherits from `PluginHolder.sol`. It has the following functions:
- `mintNFT(address to, uint256 tokenId)` - This function is used to mint a NFT.
- `transferNFT(address to, uint256 tokenId)` - This function is used to transfer a NFT. This function has to call `emit_transfer` in the plugin contract to notify that the NFT has been transferred.
-

#### TreeDonationPlugin.sol
This is a sample plugin contract that inherits from `Plugin.sol`. It has the following functions:
- `attachToNFTContract()` - This function is used to attach the plugin to a NFT contract.
- `detachFromNFTContract()` - This function is used to detach the plugin from a NFT contract.
