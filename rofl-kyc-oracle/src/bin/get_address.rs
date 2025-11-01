use rofl_kyc_oracle::signature::ECDSASigner;

fn main() {
    let private_key = std::env::var("ROFL_PRIVATE_KEY")
        .expect("ROFL_PRIVATE_KEY not set");

    let signer = ECDSASigner::new(&private_key).unwrap();
    let address = signer.get_address();

    println!("ROFL ECDSA Address: {}", address);
    println!("\nPlease copy this address to:");
    println!("1. quantum-shield-contracts/.env as ROFL_ADDRESS");
    println!("2. Use it when deploying KYCRegistry contract");
}
