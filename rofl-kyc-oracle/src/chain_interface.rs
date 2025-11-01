use ethers::prelude::*;
use ethers::abi::Token;

pub struct SapphireChain {
    provider: Provider<Http>,
    wallet: LocalWallet,
    registry_address: Address,
}

impl SapphireChain {
    pub async fn new(
        rpc_url: &str,
        private_key: &str,
        registry_address: &str,
    ) -> Result<Self, Box<dyn std::error::Error>> {
        let provider = Provider::<Http>::try_from(rpc_url)?;
        let wallet: LocalWallet = private_key.parse()?;
        let wallet = wallet.with_chain_id(23295u64);
        let registry_addr: Address = registry_address.parse()?;

        log::info!("🔑 ROFL Oracle Address: {:?}", wallet.address());

        Ok(Self {
            provider,
            wallet,
            registry_address: registry_addr,
        })
    }

    pub async fn register_verification(
        &self,
        user_hash: [u8; 32],
        is_valid: bool,
        verification_level: u8,
        timestamp: u64,
        ecdsa_signature: Vec<u8>,
    ) -> Result<TxHash, Box<dyn std::error::Error>> {
        let function_selector = &ethers::utils::keccak256(
            b"registerVerification(bytes32,bool,uint8,uint256,bytes)"
        )[0..4];

        let tokens = vec![
            Token::FixedBytes(user_hash.to_vec()),
            Token::Bool(is_valid),
            Token::Uint(U256::from(verification_level)),
            Token::Uint(U256::from(timestamp)),
            Token::Bytes(ecdsa_signature),
        ];

        let encoded = ethers::abi::encode(&tokens);
        let mut call_data = function_selector.to_vec();
        call_data.extend_from_slice(&encoded);

        let tx = TransactionRequest::new()
            .to(self.registry_address)
            .data(Bytes::from(call_data))
            .gas(150_000);

        let client = SignerMiddleware::new(
            self.provider.clone(),
            self.wallet.clone(),
        );

        let pending_tx = client.send_transaction(tx, None).await?;
        let receipt = pending_tx.await?;

        match receipt {
            Some(r) => {
                log::info!("Transaction confirmed: {:?}", r.transaction_hash);
                Ok(r.transaction_hash)
            }
            None => Err("Transaction failed".into()),
        }
    }
}
