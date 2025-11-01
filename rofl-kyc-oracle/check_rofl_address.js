const { ethers } = require('ethers');

const privateKey = '0x3ee6edd4924ecc36e054d049933f686b9e9442f2c29c567c1db13e538ff7c825';
const wallet = new ethers.Wallet(privateKey);

console.log('ROFL Oracle 地址:', wallet.address);
