use serde::{Deserialize, Serialize};
use sha3::{Keccak256, Digest};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct KYCDocument {
    pub full_name: String,
    pub birth_date: String,
    pub nationality: String,
    pub document_type: String,
    pub document_number: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct KYCResult {
    pub is_valid: bool,
    pub user_hash: String,
    pub timestamp: u64,
    pub verification_level: u8,
    pub failure_reason: Option<String>,
}

pub fn verify_kyc(doc: KYCDocument) -> KYCResult {
    let age = match calculate_age(&doc.birth_date) {
        Ok(a) => a,
        Err(e) => {
            return KYCResult {
                is_valid: false,
                user_hash: compute_user_hash(&doc),
                timestamp: current_timestamp(),
                verification_level: 0,
                failure_reason: Some(format!("Invalid birth date: {}", e)),
            };
        }
    };

    if age < 18 {
        return KYCResult {
            is_valid: false,
            user_hash: compute_user_hash(&doc),
            timestamp: current_timestamp(),
            verification_level: 0,
            failure_reason: Some(format!("Age below 18: {}", age)),
        };
    }

    if check_ofac_sanctions(&doc.full_name) {
        return KYCResult {
            is_valid: false,
            user_hash: compute_user_hash(&doc),
            timestamp: current_timestamp(),
            verification_level: 0,
            failure_reason: Some("On OFAC sanctions list".to_string()),
        };
    }

    if doc.document_number.len() < 6 {
        return KYCResult {
            is_valid: false,
            user_hash: compute_user_hash(&doc),
            timestamp: current_timestamp(),
            verification_level: 0,
            failure_reason: Some("Invalid document number".to_string()),
        };
    }

    KYCResult {
        is_valid: true,
        user_hash: compute_user_hash(&doc),
        timestamp: current_timestamp(),
        verification_level: 2,
        failure_reason: None,
    }
}

fn calculate_age(birth_date: &str) -> Result<u32, String> {
    let parts: Vec<&str> = birth_date.split('-').collect();
    if parts.len() != 3 {
        return Err("Invalid date format".to_string());
    }

    let year: u32 = parts[0].parse()
        .map_err(|_| "Invalid year".to_string())?;

    let current_year = 2025;
    Ok(current_year - year)
}

fn check_ofac_sanctions(name: &str) -> bool {
    let sanctioned = vec![
        "Vladimir Putin",
        "Kim Jong Un",
    ];
    sanctioned.iter().any(|&s| name.contains(s))
}

fn compute_user_hash(doc: &KYCDocument) -> String {
    let combined_input = format!("{}{}", doc.full_name, doc.birth_date);

    log::info!("📊 Computing userHash:");
    log::info!("   Full name: {}", doc.full_name);
    log::info!("   Birth date: {}", doc.birth_date);
    log::info!("   Combined input: {}", combined_input);

    let mut hasher = Keccak256::new();
    hasher.update(combined_input.as_bytes());
    let hash = format!("0x{:x}", hasher.finalize());

    log::info!("   Backend userHash (keccak256): {}", hash);

    hash
}

fn current_timestamp() -> u64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs()
}
