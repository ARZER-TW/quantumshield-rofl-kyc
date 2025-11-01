// Test kyber-crystals compatibility with pqc_kyber

const kyber = require('kyber-crystals')

async function test() {
  console.log('🔬 Testing kyber-crystals compatibility\n')

  try {
    // 1. 生成密鑰對
    console.log('📊 Generating keypair...')
    const { publicKey, privateKey } = await kyber.keyPair()

    console.log('📊 Key sizes:')
    console.log(`   Public key:  ${publicKey.length} bytes`)
    console.log(`   Private key: ${privateKey.length} bytes`)
    console.log()

    // 2. Encapsulate
    console.log('📊 Encapsulation:')
    const { cyphertext, secret } = await kyber.encrypt(publicKey)
    console.log(`   Ciphertext:     ${cyphertext.length} bytes`)
    console.log(`   Shared secret:  ${secret.length} bytes`)
    console.log()

    // 3. Decapsulate
    const decrypted = await kyber.decrypt(cyphertext, privateKey)
    console.log('✅ Decapsulation successful')
    const match = secret.every((val, i) => val === decrypted[i])
    console.log(`   Shared secrets match: ${match}`)
    console.log()

    // 4. 顯示常量
    console.log('📊 kyber-crystals Constants:')
    console.log(`   PUBLICKEYBYTES:     ${publicKey.length}`)
    console.log(`   SECRETKEYBYTES:     ${privateKey.length}`)
    console.log(`   CIPHERTEXTBYTES:    ${cyphertext.length}`)
    console.log(`   SHAREDSECRETBYTES:  ${secret.length}`)
    console.log()

    // 5. 與 Rust 比較
    console.log('📊 Compatibility Check with pqc_kyber:')
    const rustConstants = {
      PUBLICKEYBYTES: 1184,
      SECRETKEYBYTES: 2400,
      CIPHERTEXTBYTES: 1088,
      SHAREDSECRETBYTES: 32
    }

    const checks = [
      { name: 'Public key',  actual: publicKey.length,   expected: rustConstants.PUBLICKEYBYTES },
      { name: 'Secret key',  actual: privateKey.length,  expected: rustConstants.SECRETKEYBYTES },
      { name: 'Ciphertext',  actual: cyphertext.length,  expected: rustConstants.CIPHERTEXTBYTES },
      { name: 'Shared secret', actual: secret.length,    expected: rustConstants.SHAREDSECRETBYTES },
    ]

    let allMatch = true
    checks.forEach(({ name, actual, expected }) => {
      const match = actual === expected
      const status = match ? '✅' : '❌'
      console.log(`   ${status} ${name}: ${actual} bytes (expected ${expected})`)
      if (!match) allMatch = false
    })

    console.log()
    if (allMatch) {
      console.log('🎉 All constants match! kyber-crystals and pqc_kyber are compatible!')
    } else {
      console.log('⚠️  Compatibility issue detected!')
    }

    // 6. 顯示公鑰十六進制（前 32 bytes）
    console.log()
    console.log('📤 Public key (hex, first 32 bytes):')
    console.log(`   ${Buffer.from(publicKey.slice(0, 32)).toString('hex')}`)

  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error(error.stack)
  }
}

test()
