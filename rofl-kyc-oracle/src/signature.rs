use secp256k1::{Secp256k1, SecretKey, Message};
use sha2::{Sha256, Digest};
use sha3::{Keccak256};

pub struct ECDSASigner {
    secret_key: SecretKey,
}

impl ECDSASigner {
    pub fn new(private_key: &str) -> Result<Self, String> {
        let key_bytes = hex::decode(private_key.trim_start_matches("0x"))
            .map_err(|e| format!("Invalid hex: {}", e))?;

        let secret_key = SecretKey::from_slice(&key_bytes)
            .map_err(|e| format!("Invalid key: {}", e))?;

        Ok(Self { secret_key })
    }

    pub fn sign(&self, message_hash: &[u8]) -> Result<Vec<u8>, String> {
        // message_hash 應該是 32 字節的哈希值
        if message_hash.len() != 32 {
            return Err(format!("Message hash must be 32 bytes, got {}", message_hash.len()));
        }

        let secp = Secp256k1::new();

        // 構建以太坊簽名消息格式
        // ethSignedHash = keccak256("\x19Ethereum Signed Message:\n32" + messageHash)
        use sha3::Digest;
        let mut eth_message = Vec::new();
        eth_message.extend_from_slice(b"\x19Ethereum Signed Message:\n32");
        eth_message.extend_from_slice(message_hash);

        let mut hasher = Keccak256::new();
        hasher.update(&eth_message);
        let eth_signed_hash = hasher.finalize();

        let message = Message::from_slice(&eth_signed_hash)
            .map_err(|e| format!("Invalid message: {}", e))?;

        // 使用 sign_ecdsa_recoverable
        use secp256k1::ecdsa::{RecoverableSignature, RecoveryId};

        // 創建普通簽名
        let sig = secp.sign_ecdsa(&message, &self.secret_key);
        let sig_bytes = sig.serialize_compact();

        // 找到正確的 recovery_id
        let public_key = secp256k1::PublicKey::from_secret_key(&secp, &self.secret_key);
        let mut v = 0u8;

        for i in 0..4 {
            if let Ok(rec_id) = RecoveryId::from_i32(i) {
                if let Ok(rec_sig) = RecoverableSignature::from_compact(&sig_bytes, rec_id) {
                    // 使用 Secp256k1::recover_ecdsa
                    if let Ok(recovered_key) = secp.recover_ecdsa(&message, &rec_sig) {
                        if recovered_key == public_key {
                            v = i as u8;
                            break;
                        }
                    }
                }
            }
        }

        // 構建 65 字節的簽名 (r + s + v)
        let mut result = Vec::with_capacity(65);
        result.extend_from_slice(&sig_bytes);
        result.push(v);  // v value

        log::debug!("📝 ECDSA Signature:");
        log::debug!("   Message hash: 0x{}", hex::encode(message_hash));
        log::debug!("   Eth signed hash: 0x{}", hex::encode(&eth_signed_hash));
        log::debug!("   Signature (r+s+v): 0x{}", hex::encode(&result));
        log::debug!("   v (recovery_id): {}", v);

        Ok(result)
    }

    pub fn get_address(&self) -> String {
        let secp = Secp256k1::new();
        let public_key = secp256k1::PublicKey::from_secret_key(&secp, &self.secret_key);
        let public_key_bytes = public_key.serialize_uncompressed();

        let mut hasher = Keccak256::new();
        hasher.update(&public_key_bytes[1..]);
        let hash = hasher.finalize();

        format!("0x{}", hex::encode(&hash[12..]))
    }
}
