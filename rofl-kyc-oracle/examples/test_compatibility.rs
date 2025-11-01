//! 測試 pqc_kyber 與 kyber-crystals 的兼容性

use pqc_kyber::*;

fn main() {
    println!("🔬 Testing Kyber768 compatibility\n");

    // 1. 生成密鑰對
    let mut rng = rand::thread_rng();
    let keypair = keypair(&mut rng).unwrap();

    println!("📊 Key sizes:");
    println!("   Public key:  {} bytes", keypair.public.len());
    println!("   Secret key:  {} bytes", keypair.secret.len());
    println!();

    // 2. 測試 encapsulate
    let (ciphertext, shared_secret) = encapsulate(&keypair.public, &mut rng).unwrap();

    println!("📊 Encapsulation:");
    println!("   Ciphertext:     {} bytes", ciphertext.len());
    println!("   Shared secret:  {} bytes", shared_secret.len());
    println!();

    // 3. 測試 decapsulate
    let decapped_secret = decapsulate(&ciphertext, &keypair.secret).unwrap();

    println!("✅ Decapsulation successful");
    println!("   Shared secrets match: {}", shared_secret == decapped_secret);
    println!();

    // 4. 顯示標準常量
    println!("📊 Kyber768 Constants:");
    println!("   PUBLICKEYBYTES:     {}", KYBER_PUBLICKEYBYTES);
    println!("   SECRETKEYBYTES:     {}", KYBER_SECRETKEYBYTES);
    println!("   CIPHERTEXTBYTES:    {}", KYBER_CIPHERTEXTBYTES);
    println!("   SHAREDSECRETBYTES:  {}", KYBER_SSBYTES);
    println!();

    // 5. 匯出公鑰（用於前端測試）
    println!("📤 Public key (hex, first 32 bytes):");
    println!("   {}", hex::encode(&keypair.public[..32]));
}
