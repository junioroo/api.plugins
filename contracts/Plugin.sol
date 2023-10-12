// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

abstract contract Plugin {

    // Event emitted when an NFT is transferred
    event NFTTransferred(uint256 indexed tokenId, address indexed from, address indexed to);

    /**
     * @dev Function to transfer ownership of an NFT and emit a transfer event.
     * @param from The current owner of the NFT.
     * @param to The new owner of the NFT.
     * @param tokenId The ID of the NFT being transferred.
     */
    function emit_transfer(address from, address to, uint256 tokenId) external {
        emit NFTTransferred(tokenId, from, to);
    }
}
