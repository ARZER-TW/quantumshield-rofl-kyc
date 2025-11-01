// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/KYCRegistry.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address roflAddress = vm.envAddress("ROFL_ADDRESS");

        vm.startBroadcast(deployerPrivateKey);

        KYCRegistry registry = new KYCRegistry(roflAddress);
        console.log("KYCRegistry deployed at:", address(registry));

        vm.stopBroadcast();

        string memory json = string(abi.encodePacked(
            '{"kycRegistry":"', vm.toString(address(registry)),
            '","roflNode":"', vm.toString(roflAddress),
            '","chainId":', vm.toString(block.chainid), '}'
        ));

        vm.writeFile("deployments/sapphire_testnet.json", json);
    }
}
