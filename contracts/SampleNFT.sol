// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./PluginHolder.sol";  // Import your PluginHolder contract
import "./Plugin.sol";  // Import your PluginHolder contract

// Create a SampleNFT contract that inherits ERC721 and PluginHolder.
contract SampleNFT is ERC721, PluginHolder {
    // Event for minting an NFT.
    event NFTMinted(address indexed to, uint256 tokenId, address sender);
    event NFTCreated(address indexed owner);

    // Address of the Plugin contract
    address public plugin;  // Add this state variable

    // Constructor with corrected signature.
    constructor(address initialOwner) ERC721("SampleNFT", "SampleNFT") PluginHolder(initialOwner) {
        emit NFTCreated(initialOwner);
    }

    // Mint a new NFT and emit the NFTMinted event.
    function mintNFT(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
        plugins[tokenId] = PluginData(plugin, true);  // Initialize the plugins mapping
        emit NFTMinted(to, tokenId, msg.sender);
    }

    // Transfer an NFT to another address and notify the attached plugin.
    function transferNFT(address to, uint256 tokenId) external onlyOwner {
        require(ownerOf(tokenId) == msg.sender, "Transfer caller is not the owner");
        address from = ownerOf(tokenId);
        _safeTransfer(from, to, tokenId);

        // Notify the attached plugin.
        address pluginAddress = plugins[tokenId].pluginAddress;
        Plugin(pluginAddress).emit_transfer(from, to, tokenId);
    }
}
