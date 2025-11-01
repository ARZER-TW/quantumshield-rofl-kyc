// KYCRegistry Contract Configuration
// Deployed to Sapphire Testnet at 2025-11-01 02:04
export const KYC_REGISTRY_ADDRESS = '0xe0e1EB1c77A0f280ADf74D09205f474d6bbbc3d2' as const

export const KYC_REGISTRY_ABI = [
  {
    type: 'function',
    name: 'isVerified',
    stateMutability: 'view',
    inputs: [{ name: 'userHash', type: 'bytes32' }],
    outputs: [{ type: 'bool' }],
  },
  {
    type: 'function',
    name: 'registerVerification',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'userHash', type: 'bytes32' },
      { name: 'isValid', type: 'bool' },
      { name: 'verificationLevel', type: 'uint8' },
      { name: 'timestamp', type: 'uint256' },
      { name: 'ecdsaSignature', type: 'bytes' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    type: 'function',
    name: 'verifications',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'bytes32' }],
    outputs: [
      { name: 'isValid', type: 'bool' },
      { name: 'verificationLevel', type: 'uint8' },
      { name: 'timestamp', type: 'uint256' },
    ],
  },
  {
    type: 'event',
    name: 'VerificationRegistered',
    inputs: [
      { name: 'userHash', type: 'bytes32', indexed: true },
      { name: 'isValid', type: 'bool', indexed: false },
      { name: 'verificationLevel', type: 'uint8', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false },
    ],
  },
] as const
