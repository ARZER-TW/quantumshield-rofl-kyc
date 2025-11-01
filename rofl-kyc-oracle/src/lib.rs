mod pqc_module;
mod kyc_verifier;
pub mod signature;
mod chain_interface;

pub use kyc_verifier::{KYCDocument, KYCResult};
pub use signature::ECDSASigner;

use pqc_module::KyberHandler;
use kyc_verifier::verify_kyc;
use chain_interface::SapphireChain;

pub struct QuantumShieldOracle {
    kyber: KyberHandler,
    signer: ECDSASigner,
    chain: SapphireChain,
}

impl QuantumShieldOracle {
    pub async fn new() -> Result<Self, Box<dyn std::error::Error>> {
        let kyber = KyberHandler::new();

        let ecdsa_key = std::env::var("ROFL_PRIVATE_KEY")?;
        let signer = ECDSASigner::new(&ecdsa_key)?;

        let chain = SapphireChain::new(
            &std::env::var("SAPPHIRE_RPC")?,
            &ecdsa_key,
            &std::env::var("KYC_REGISTRY_ADDRESS")?,
        ).await?;

        Ok(Self { kyber, signer, chain })
    }

    pub fn get_kyber_public_key(&self) -> Vec<u8> {
        self.kyber.get_public_key()
    }

    pub async fn process_kyc_request(
        &self,
        encrypted_package: Vec<u8>,
    ) -> Result<String, Box<dyn std::error::Error>> {
        // Kyber768 解密
        let decrypted_data = self.kyber.decrypt(&encrypted_package)?;
        let kyc_doc: KYCDocument = serde_json::from_slice(&decrypted_data)?;

        log::info!("ℹ️  Decrypted KYC Document:");
        log::info!("   Full name: {}", kyc_doc.full_name);
        log::info!("   Birth date: {}", kyc_doc.birth_date);
        log::info!("   Nationality: {}", kyc_doc.nationality);
        log::info!("   Document type: {}", kyc_doc.document_type);
        log::info!("   Document number: {}", kyc_doc.document_number);

        let result = verify_kyc(kyc_doc);

        log::info!("✅ KYC Verification Result:");
        log::info!("   is_valid: {}", result.is_valid);
        log::info!("   verification_level: {}", result.verification_level);
        if let Some(ref reason) = result.failure_reason {
            log::warn!("   ❌ Failure reason: {}", reason);
        }

        // 準備 userHash
        let user_hash_hex = result.user_hash.trim_start_matches("0x");
        let user_hash_bytes = hex::decode(user_hash_hex)?;
        let mut user_hash = [0u8; 32];
        user_hash.copy_from_slice(&user_hash_bytes[..32]);

        // 構建合約期望的 messageHash
        // messageHash = keccak256(abi.encodePacked(userHash, isValid, verificationLevel, timestamp))
        // Solidity uint256 是 32 字節，需要將 u64 擴展為 32 字節大端格式
        use sha3::{Keccak256, Digest};
        let mut hasher = Keccak256::new();
        hasher.update(&user_hash);  // 32 bytes
        hasher.update(&[if result.is_valid { 1u8 } else { 0u8 }]);  // 1 byte
        hasher.update(&[result.verification_level]);  // 1 byte

        // timestamp 作為 uint256 (32 bytes, big-endian)
        let mut timestamp_bytes = [0u8; 32];
        let timestamp_u64_bytes = result.timestamp.to_be_bytes();
        timestamp_bytes[24..32].copy_from_slice(&timestamp_u64_bytes);  // 最後 8 字節
        hasher.update(&timestamp_bytes);  // 32 bytes

        let message_hash: [u8; 32] = hasher.finalize().into();

        log::info!("📝 Signing message:");
        log::info!("   userHash: 0x{}", hex::encode(&user_hash));
        log::info!("   isValid: {}", result.is_valid);
        log::info!("   verificationLevel: {}", result.verification_level);
        log::info!("   timestamp: {}", result.timestamp);
        log::info!("   messageHash: 0x{}", hex::encode(&message_hash));

        // 對 messageHash 簽名
        let ecdsa_signature = self.signer.sign(&message_hash)?;

        let tx_hash = self.chain.register_verification(
            user_hash,
            result.is_valid,
            result.verification_level,
            result.timestamp,
            ecdsa_signature,
        ).await?;

        Ok(format!("{:?}", tx_hash))
    }
}
