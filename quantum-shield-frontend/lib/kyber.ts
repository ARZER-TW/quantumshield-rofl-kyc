const kyber = require('kyber-crystals')

/**
 * 從 ROFL 獲取公鑰
 */
async function getROFLPublicKey(): Promise<Uint8Array> {
  const response = await fetch('/api/kyber-public-key')
  const data = await response.json()

  // 將 number[] 轉換為 Uint8Array
  return new Uint8Array(data.publicKey)
}

/**
 * 用 Kyber768 加密 KYC 資料
 */
export async function encryptKYCData(data: any): Promise<Uint8Array> {
  console.log('🔐 Starting Kyber encryption...')

  // 1. 獲取 ROFL 公鑰
  console.log('   📡 Fetching ROFL public key...')
  const publicKey = await getROFLPublicKey()
  console.log(`   ✅ Got public key: ${publicKey.length} bytes`)

  // 2. Kyber Encapsulate
  console.log('   🔑 Encapsulating...')
  const { cyphertext, secret } = await kyber.encrypt(publicKey)
  console.log(`   ✅ Ciphertext: ${cyphertext.length} bytes`)
  console.log(`   ✅ Shared secret: ${secret.length} bytes`)

  // 3. 用 Shared Secret 加密資料（Web Crypto API）
  console.log('   🔒 Encrypting data with AES-GCM...')

  const key = await crypto.subtle.importKey(
    'raw',
    secret.slice(0, 32), // 使用前 32 bytes 作為 AES-256 密鑰
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  )

  const nonce = crypto.getRandomValues(new Uint8Array(12))
  const dataBytes = new TextEncoder().encode(JSON.stringify(data))

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: nonce },
    key,
    dataBytes
  )

  console.log(`   ✅ Encrypted data: ${encrypted.byteLength} bytes`)

  // 4. 組合最終封包
  const totalLength = cyphertext.length + nonce.length + encrypted.byteLength
  const finalPackage = new Uint8Array(totalLength)

  let offset = 0
  finalPackage.set(cyphertext, offset)
  offset += cyphertext.length

  finalPackage.set(nonce, offset)
  offset += nonce.length

  finalPackage.set(new Uint8Array(encrypted), offset)

  console.log(`   📦 Final package: ${finalPackage.length} bytes`)
  console.log('   ✅ Encryption complete!')

  return finalPackage
}
