use pqc_kyber::*;

pub struct KyberHandler {
    keypair: Keypair,
}

impl KyberHandler {
    pub fn new() -> Self {
        let mut rng = rand::thread_rng();
        let keypair = keypair(&mut rng).expect("Failed to generate keypair");

        log::info!("✅ Kyber768 keypair generated (pqc_kyber)");
        log::info!("   Public key: {} bytes", keypair.public.len());
        log::info!("   Secret key: {} bytes", keypair.secret.len());

        Self { keypair }
    }

    pub fn get_public_key(&self) -> Vec<u8> {
        self.keypair.public.to_vec()
    }

    pub fn decrypt(&self, encrypted_package: &[u8]) -> Result<Vec<u8>, String> {
        // 分離 Kyber ciphertext 和 AES 加密資料
        if encrypted_package.len() < KYBER_CIPHERTEXTBYTES {
            return Err(format!(
                "Invalid package size: {} < {}",
                encrypted_package.len(),
                KYBER_CIPHERTEXTBYTES
            ));
        }

        let (ciphertext_bytes, aes_encrypted) =
            encrypted_package.split_at(KYBER_CIPHERTEXTBYTES);

        // Kyber 解封裝
        let mut ciphertext = [0u8; KYBER_CIPHERTEXTBYTES];
        ciphertext.copy_from_slice(ciphertext_bytes);

        let shared_secret = decapsulate(&ciphertext, &self.keypair.secret)
            .map_err(|e| format!("Decapsulation failed: {:?}", e))?;

        // AES-GCM 解密
        use aes_gcm::{Aes256Gcm, Key, Nonce, aead::{Aead, KeyInit}};

        if aes_encrypted.len() < 12 {
            return Err("Invalid AES package".to_string());
        }

        let (nonce_bytes, ciphertext) = aes_encrypted.split_at(12);
        let nonce = Nonce::from_slice(nonce_bytes);

        let key = Key::<Aes256Gcm>::from_slice(&shared_secret);
        let cipher = Aes256Gcm::new(key);

        let plaintext = cipher.decrypt(nonce, ciphertext)
            .map_err(|e| format!("AES decryption failed: {}", e))?;

        log::info!("✅ Decryption successful: {} bytes", plaintext.len());
        Ok(plaintext)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_kyber_roundtrip() {
        let handler = KyberHandler::new();
        let pk = handler.get_public_key();

        // 測試 encapsulate
        let mut rng = rand::thread_rng();
        let (ciphertext, shared_secret) = encapsulate(&pk, &mut rng).unwrap();

        // 測試 decapsulate
        let decapped = decapsulate(&ciphertext, &handler.keypair.secret).unwrap();

        assert_eq!(shared_secret, decapped);
    }
}
