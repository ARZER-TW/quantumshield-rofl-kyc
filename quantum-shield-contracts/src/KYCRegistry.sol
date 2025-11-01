// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract KYCRegistry {

    struct VerificationRecord {
        bool isValid;
        uint8 verificationLevel;
        uint256 timestamp;
    }

    mapping(address => bool) public registeredROFLNodes;
    mapping(bytes32 => VerificationRecord) public verifications;
    address public owner;

    event ROFLNodeRegistered(address indexed node);
    event VerificationRegistered(bytes32 indexed userHash, bool isValid, uint8 verificationLevel, uint256 timestamp);

    error Unauthorized();
    error InvalidROFLNode();
    error InvalidVerificationData();

    constructor(address initialROFLNode) {
        owner = msg.sender;
        if (initialROFLNode != address(0)) {
            registeredROFLNodes[initialROFLNode] = true;
            emit ROFLNodeRegistered(initialROFLNode);
        }
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    function registerVerification(
        bytes32 userHash,
        bool isValid,
        uint8 verificationLevel,
        uint256 timestamp,
        bytes memory ecdsaSignature
    ) external returns (bool) {
        if (userHash == bytes32(0)) revert InvalidVerificationData();
        if (verificationLevel > 2) revert InvalidVerificationData();
        if (timestamp > block.timestamp + 300) revert InvalidVerificationData();

        bytes32 messageHash = keccak256(
            abi.encodePacked(userHash, isValid, verificationLevel, timestamp)
        );

        address signer = recoverSigner(messageHash, ecdsaSignature);

        if (!registeredROFLNodes[signer]) revert InvalidROFLNode();

        verifications[userHash] = VerificationRecord({
            isValid: isValid,
            verificationLevel: verificationLevel,
            timestamp: timestamp
        });

        emit VerificationRegistered(userHash, isValid, verificationLevel, timestamp);

        return true;
    }

    function recoverSigner(bytes32 messageHash, bytes memory signature) internal pure returns (address) {
        require(signature.length == 65, "Invalid signature length");

        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }

        if (v < 27) {
            v += 27;
        }

        require(v == 27 || v == 28, "Invalid signature v value");

        bytes32 ethSignedHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );

        return ecrecover(ethSignedHash, v, r, s);
    }

    function isVerified(bytes32 userHash) external view returns (bool) {
        return verifications[userHash].isValid;
    }

    function registerROFLNode(address node) external onlyOwner {
        require(node != address(0), "Zero address");
        registeredROFLNodes[node] = true;
        emit ROFLNodeRegistered(node);
    }
}
