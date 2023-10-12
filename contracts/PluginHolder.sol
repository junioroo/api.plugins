// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PluginHolder
 * @dev Abstract contract for holding plugins associated with an NFT.
 */
abstract contract PluginHolder is Ownable {
    // Mapping to store plugin data for each NFT token ID
    mapping(uint256 => PluginData) public plugins;

    // Structure to represent plugin data
    struct PluginData {
        address pluginAddress; // Address of the plugin contract
        bool enabled; // Flag indicating whether the plugin is enabled
    }

    // Event emitted when a plugin is attached to an NFT
    event PluginAttached(uint256 indexed tokenId, address indexed pluginAddress);

    // Event emitted when a plugin is detached from an NFT
    event PluginDetached(uint256 indexed tokenId, address indexed pluginAddress);

    /**
     * @dev Constructor for the PluginHolder contract with an initial owner.
     */
    constructor(address initialOwner) Ownable(initialOwner) {
    }

    // Attach a plugin to an NFT.
    function attachPlugin(address pluginAddress, uint256 tokenId) external virtual onlyOwner {
        require(pluginAddress != address(0), "Invalid plugin address");

        plugins[tokenId] = PluginData(pluginAddress, true);
        emit PluginAttached(tokenId, pluginAddress);
    }

    // Detach a plugin from an NFT.
    function detachPlugin(uint256 tokenId) external virtual onlyOwner {
        require(plugins[tokenId].enabled, "Plugin not attached");
        plugins[tokenId].enabled = false;
        emit PluginDetached(tokenId, plugins[tokenId].pluginAddress);
    }

    // Check if a plugin is attached to an NFT.
    function isPluginAttached(uint256 tokenId) external view returns (bool) {
        return plugins[tokenId].enabled;
    }

    // Get the plugin address attached to an NFT.
    function getAttachedPluginAddress(uint256 tokenId) external view returns (address) {
        return plugins[tokenId].pluginAddress;
    }
}
