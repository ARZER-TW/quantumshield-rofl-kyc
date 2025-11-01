// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/KYCRegistry.sol";

contract RegisterROFLScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address contractAddress = vm.envAddress("CONTRACT_ADDRESS");
        address roflNode = vm.envAddress("ROFL_NODE");

        vm.startBroadcast(deployerPrivateKey);

        KYCRegistry registry = KYCRegistry(contractAddress);

        console.log("Registering ROFL node:", roflNode);
        console.log("Contract address:", contractAddress);

        registry.registerROFLNode(roflNode);

        console.log("ROFL node registered successfully!");

        vm.stopBroadcast();
    }
}
