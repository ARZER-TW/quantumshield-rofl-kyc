use axum::{
    routing::{get, post},
    Router,
    Json,
    extract::State,
    http::{StatusCode, Method},
    body::Bytes,
};
use tower_http::cors::{CorsLayer, Any};
use rofl_kyc_oracle::QuantumShieldOracle;
use std::sync::Arc;

#[tokio::main]
async fn main() {
    env_logger::init();

    // 初始化 Oracle（共享實例）
    let oracle = Arc::new(
        QuantumShieldOracle::new()
            .await
            .expect("Failed to initialize Oracle")
    );

    log::info!("✅ QuantumShieldOracle initialized");

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST])
        .allow_headers(Any);

    let app = Router::new()
        .route("/verify-kyc", post(handle_kyc))
        .route("/public-key", get(handle_public_key))
        .layer(cors)
        .with_state(oracle);

    let addr = "127.0.0.1:8080".parse().unwrap();

    println!("🚀 ROFL Oracle running on http://127.0.0.1:8080");
    println!("   📡 Endpoints:");
    println!("      POST /verify-kyc - Submit encrypted KYC data");
    println!("      GET  /public-key - Get Kyber768 public key");

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

async fn handle_public_key(
    State(oracle): State<Arc<QuantumShieldOracle>>,
) -> Json<serde_json::Value> {
    let public_key = oracle.get_kyber_public_key();

    log::info!("📤 Public key requested: {} bytes", public_key.len());

    Json(serde_json::json!({
        "public_key": public_key
    }))
}

async fn handle_kyc(
    State(oracle): State<Arc<QuantumShieldOracle>>,
    body: Bytes,
) -> Result<Json<serde_json::Value>, StatusCode> {
    log::info!("📥 Received encrypted KYC request");

    let encrypted_package = body.to_vec();
    log::info!("   Package size: {} bytes", encrypted_package.len());

    match oracle.process_kyc_request(encrypted_package).await {
        Ok(tx_hash) => {
            log::info!("✅ KYC verified and sent to chain: {}", tx_hash);
            Ok(Json(serde_json::json!({
                "success": true,
                "tx_hash": tx_hash,
                "message": "KYC verification submitted to blockchain"
            })))
        }
        Err(e) => {
            log::error!("❌ KYC verification failed: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}
