// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./PluginHolder.sol";
import "./Plugin.sol";

contract TreeDonationPlugin is Plugin {
    address public nftContractAddress; // Address of the NFT contract
    uint256 public tokenId;

    event PluginCreated(address indexed nftContractAddress);

    constructor(address _nftContractAddress, uint256 _tokenId) {
        nftContractAddress = _nftContractAddress;
        tokenId = _tokenId;
        emit PluginCreated(_nftContractAddress);
    }

    // Function to attach this plugin to the NFT contract
    function attachToNFTContract() external {
        PluginHolder nftContract = PluginHolder(nftContractAddress);
        nftContract.attachPlugin(address(this), tokenId);
    }

    // Function to detach this plugin from the NFT contract
    function detachFromNFTContract() external {
        PluginHolder nftContract = PluginHolder(nftContractAddress);
        nftContract.detachPlugin(tokenId);
    }
}
