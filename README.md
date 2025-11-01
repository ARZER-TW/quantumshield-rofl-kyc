# QuantumShield ROFL KYC Oracle

**後量子密碼學驅動的去中心化 KYC 驗證系統**

基於 Oasis Sapphire 的隱私保護、後量子安全的 KYC 驗證解決方案，使用 ROFL (Runtime Off-chain Logic) 在可信執行環境 (TEE) 中處理敏感資料。

---

## 🌟 專案特色

### 🔐 後量子安全
- **Kyber1024 加密**: NIST 標準的後量子密鑰封裝機制 (KEM)，提供 Level 5 安全級別
- **端到端加密**: 敏感的 KYC 資料在前端加密，只在 TEE 中解密
- **抗量子攻擊**: 保護用戶資料免受未來量子計算機的威脅

### 🛡️ 隱私保護
- **零知識架構**: 原始 KYC 資料不上鏈，只存儲驗證結果
- **鏈下處理**: 敏感資料在 ROFL Oracle 的 TEE 環境中處理
- **匿名化**: 使用 userHash 作為鏈上識別符

### ⛓️ 去中心化驗證
- **智能合約驗證**: Sapphire 智能合約使用 ECDSA 驗證 Oracle 簽名
- **不可篡改記錄**: 驗證結果永久存儲在區塊鏈上
- **透明可審計**: 所有驗證記錄可公開查詢

---

## 🏗️ 系統架構

```
┌─────────────────┐
│   用戶瀏覽器     │
│  (Next.js 前端)  │
└────────┬────────┘
         │ 1. KYC 表單資料
         │ 2. Kyber1024 加密
         ↓
┌─────────────────┐
│  ROFL Oracle    │
│  (Rust + Axum)  │
│                 │
│ ┌─────────────┐ │
│ │   TEE 環境   │ │ 3. Kyber 解密
│ │  Kyber 解密  │ │ 4. KYC 驗證
│ │  KYC 驗證    │ │ 5. ECDSA 簽名
│ └─────────────┘ │
└────────┬────────┘
         │ 6. 提交驗證結果
         ↓
┌─────────────────┐
│  Sapphire 鏈    │
│  KYCRegistry    │ 7. 簽名驗證
│  智能合約       │ 8. 存儲記錄
└────────┬────────┘
         │ 9. 查詢驗證狀態
         ↓
┌─────────────────┐
│   用戶瀏覽器     │
│   顯示結果      │
└─────────────────┘
```

---

## 📦 專案結構

```
claude-test/
├── quantum-shield-frontend/    # Next.js 前端應用
│   ├── app/                     # Next.js 13+ App Router
│   │   ├── page.tsx            # 主頁面 (KYC 表單 + 查詢)
│   │   └── api/                # API Routes
│   ├── lib/                     # 工具函數
│   │   ├── kyber.ts            # Kyber1024 加密
│   │   └── contracts.ts        # 智能合約配置
│   └── package.json
│
├── rofl-kyc-oracle/            # ROFL Oracle 後端
│   ├── src/
│   │   ├── lib.rs              # 主要業務邏輯
│   │   ├── pqc_module.rs       # Kyber 加密/解密
│   │   ├── kyc_verifier.rs     # KYC 驗證邏輯
│   │   ├── signature.rs        # ECDSA 簽名
│   │   ├── chain_interface.rs  # 區塊鏈交互
│   │   └── bin/
│   │       └── rofl_server.rs  # HTTP 服務器
│   ├── Cargo.toml
│   ├── .env.example            # 環境變數範本
│   └── start_rofl_server.sh    # 啟動腳本
│
└── quantum-shield-contracts/   # Solidity 智能合約
    ├── src/
    │   └── KYCRegistry.sol     # KYC 註冊與驗證合約
    ├── script/
    │   └── Deploy.s.sol        # 部署腳本
    ├── .env.example            # 環境變數範本
    └── foundry.toml
```

---

## 🚀 快速開始

### 前置需求

- **Node.js** 18+
- **Rust** 1.70+ (with `cargo`)
- **Foundry** (Forge, Cast)
- **Oasis Sapphire Testnet** 帳戶和測試代幣

### 1️⃣ 部署智能合約

```bash
cd quantum-shield-contracts

# 複製環境變數範本
cp .env.example .env

# 編輯 .env 填入你的私鑰
# PRIVATE_KEY=your_private_key_here

# 編譯合約
forge build

# 部署到 Sapphire Testnet
forge script script/Deploy.s.sol:DeployKYCRegistry --rpc-url https://testnet.sapphire.oasis.io --broadcast --legacy

# 記下部署的合約地址
```

### 2️⃣ 啟動 ROFL Oracle

```bash
cd rofl-kyc-oracle

# 複製環境變數範本
cp .env.example .env

# 編輯 .env 填入配置
# ROFL_PRIVATE_KEY=0xyour_private_key
# KYC_REGISTRY_ADDRESS=0xdeployed_contract_address

# 編譯並啟動
cargo build --release
./start_rofl_server.sh

# 或直接運行
RUST_LOG=info cargo run --bin rofl_server
```

Oracle 將在 `http://127.0.0.1:8080` 上運行。

### 3️⃣ 啟動前端

```bash
cd quantum-shield-frontend

# 安裝依賴
npm install

# 更新合約地址
# 編輯 lib/contracts.ts，填入部署的合約地址

# 啟動開發服務器
npm run dev
```

前端將在 `http://localhost:3000` 上運行。

### 4️⃣ 註冊 ROFL 節點

在智能合約中註冊你的 ROFL Oracle 地址：

```bash
cd quantum-shield-contracts

# 使用 cast 調用合約
cast send <CONTRACT_ADDRESS> \
  "registerROFLNode(address)" \
  <ROFL_ADDRESS> \
  --rpc-url https://testnet.sapphire.oasis.io \
  --private-key <OWNER_PRIVATE_KEY> \
  --legacy
```

---

## 💻 使用方式

### 提交 KYC 驗證

1. 在瀏覽器中打開 `http://localhost:3000`
2. 填寫 KYC 表單：
   - 全名
   - 出生日期
   - 國籍
   - 證件類型
   - 證件號碼
3. 點擊「提交 KYC 驗證」
4. 系統會：
   - 使用 Kyber1024 加密資料
   - 發送到 ROFL Oracle
   - Oracle 在 TEE 中解密並驗證
   - 提交驗證結果到 Sapphire 鏈上
5. 記下顯示的 `userHash`

### 查詢驗證狀態

1. 在提交後，點擊「查詢驗證狀態」
2. 系統會從智能合約查詢你的驗證記錄
3. 顯示：
   - ✓ KYC 驗證已通過 / ✗ 驗證未通過
   - 驗證級別 (0-2)
   - 驗證時間戳

---

## 🔧 技術細節

### Kyber1024 加密流程

```typescript
// 前端加密 (quantum-shield-frontend/lib/kyber.ts)
const kyber = require('kyber-crystals')

// 1. 獲取 ROFL 的公鑰 (1568 bytes)
const publicKey = await getROFLPublicKey()

// 2. Kyber 封裝，生成共享密鑰
const { cyphertext, secret } = await kyber.encrypt(publicKey)

// 3. 使用共享密鑰進行 AES-GCM 加密
const encrypted = await crypto.subtle.encrypt(
  { name: 'AES-GCM', iv: nonce },
  aesKey,
  plaintext
)

// 4. 打包: [kyber_ciphertext(1568) | nonce(12) | encrypted_data]
```

### KYC 驗證邏輯

```rust
// rofl-kyc-oracle/src/kyc_verifier.rs

pub fn verify_kyc(doc: KYCDocument) -> KYCResult {
    // 1. 年齡檢查 (>= 18)
    // 2. 制裁名單檢查 (OFAC)
    // 3. 證件號碼驗證
    // 4. 計算 userHash = keccak256(fullName + birthDate)

    KYCResult {
        is_valid: true,
        verification_level: 2,  // 0=基礎, 1=標準, 2=增強
        user_hash: "0x...",
        timestamp: now(),
    }
}
```

### ECDSA 簽名與驗證

```rust
// ROFL 簽名 (rofl-kyc-oracle/src/signature.rs)
let messageHash = keccak256(
    userHash || isValid || verificationLevel || timestamp
)

// 以太坊簽名格式
let ethMessage = "\x19Ethereum Signed Message:\n32" + messageHash
let signature = sign_ecdsa(keccak256(ethMessage))  // 65 bytes (r+s+v)
```

```solidity
// 智能合約驗證 (quantum-shield-contracts/src/KYCRegistry.sol)
function registerVerification(..., bytes memory ecdsaSignature) external {
    bytes32 messageHash = keccak256(
        abi.encodePacked(userHash, isValid, verificationLevel, timestamp)
    );

    address signer = recoverSigner(messageHash, ecdsaSignature);
    require(registeredROFLNodes[signer], "Invalid ROFL node");

    // 存儲驗證記錄
    verifications[userHash] = VerificationRecord(...);
}
```

---

## 🔒 安全特性

### 後量子安全
- ✅ **Kyber1024**: NIST 標準化的 PQC KEM (CRYSTALS-KYBER)
- ✅ **安全級別**: NIST Security Level 5 (256-bit quantum security)
- ✅ **密鑰大小**: 公鑰 1568 bytes, 私鑰 3168 bytes

### 隱私保護
- ✅ **端到端加密**: KYC 資料只在前端加密，TEE 中解密
- ✅ **零知識**: 原始資料不上鏈
- ✅ **匿名化**: 使用 keccak256 hash 作為識別符

### 智能合約安全
- ✅ **簽名驗證**: 使用 ECDSA `ecrecover` 驗證 Oracle 簽名
- ✅ **權限控制**: 只有註冊的 ROFL 節點可以提交驗證
- ✅ **時間戳檢查**: 防止重放攻擊 (±5 分鐘窗口)
- ✅ **參數驗證**: 檢查 userHash, verificationLevel 等參數

---

## 📊 性能指標

| 操作 | 時間 | Gas 消耗 |
|------|------|----------|
| Kyber1024 加密 | ~15ms | - |
| Kyber1024 解密 | ~10ms | - |
| KYC 驗證 | <5ms | - |
| ECDSA 簽名 | ~2ms | - |
| 鏈上註冊 | ~2-3s | 78,645 gas |
| 鏈上查詢 | <100ms | 免費 (view) |

---

## 🌐 部署資訊

### Sapphire Testnet
- **Network**: Oasis Sapphire Testnet
- **Chain ID**: 23295
- **RPC URL**: https://testnet.sapphire.oasis.io
- **Explorer**: https://explorer.oasis.io/testnet/sapphire
- **Faucet**: https://faucet.testnet.oasis.io/

### 合約地址 (範例)
```
KYCRegistry: 0xe0e1EB1c77A0f280ADf74D09205f474d6bbbc3d2
ROFL Oracle: 0x5D228D1964960512Ca9e7603E24aAEbc881C076A
```

---

## 🧪 測試

### 測試 Kyber 加密

```bash
cd quantum-shield-frontend
node test-kyber.js
```

### 測試智能合約

```bash
cd quantum-shield-contracts
forge test -vvv
```

### 端到端測試

1. 啟動所有服務 (合約、ROFL、前端)
2. 提交測試 KYC 資料
3. 檢查 ROFL 日誌確認處理流程
4. 查詢驗證狀態確認上鏈成功

---

## 📚 相關文檔

- [Oasis ROFL 文檔](https://docs.oasis.io/rofl/)
- [Sapphire 文檔](https://docs.oasis.io/dapp/sapphire/)
- [CRYSTALS-KYBER](https://pq-crystals.org/kyber/)
- [NIST PQC 標準化](https://csrc.nist.gov/projects/post-quantum-cryptography)

---

## 🛠️ 故障排除

### ROFL 無法啟動
- 檢查 `.env` 檔案是否正確配置
- 確認 Rust 版本 >= 1.70
- 檢查 8080 端口是否被占用

### 交易失敗 (status: 0x0)
- 確認 ROFL 地址已在合約中註冊
- 檢查 KYC_REGISTRY_ADDRESS 是否正確
- 查看 ROFL 日誌確認簽名生成

### 查詢顯示「未通過或不存在」
- 確認使用相同的 fullName 和 birthDate
- 等待交易確認 (約 2-3 秒)
- 檢查 userHash 計算是否一致

---

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

---

## 📄 授權

MIT License

---

## 👥 團隊

**QuantumShield 團隊** - RWA Hackathon 2025

---

## 🎯 未來規劃

- [ ] **Falcon-512 簽名**: 實作後量子數字簽名
- [ ] **生產 TEE 部署**: 在 Intel SGX 或 ARM TrustZone 上運行
- [ ] **多鏈支持**: 擴展到其他 EVM 鏈
- [ ] **增強 KYC 驗證**: 集成 OCR 和生物識別
- [ ] **去中心化 Oracle 網絡**: 多個 ROFL 節點共識
- [ ] **Mainnet 部署**: 部署到 Oasis Sapphire Mainnet

---

**Built with ❤️ for Web3 Privacy & Post-Quantum Security**
