# 黑客松提交準備指南

## ⚠️ 重要提示

本專案已經清理並準備好提交。所有敏感資訊已移除，不需要的文檔已備份。

---

## 📁 已清理的內容

### ✅ 已移除敏感資訊
- ❌ `.env` 檔案 (包含私鑰)
- ✅ 已創建 `.env.example` 範本
- ✅ 私鑰已從所有配置中移除

### ✅ 已備份的文檔
以下文檔已移到 `.hackathon-backup/` 資料夾：
- 開發過程中的調試文檔 (16 個 .md 檔案)
- 測試腳本和配置
- 不相關的專案資料夾

### ✅ 保留的核心專案
- `quantum-shield-frontend/` - Next.js 前端
- `quantum-shield-contracts/` - Solidity 智能合約
- `rofl-kyc-oracle/` - Rust ROFL Oracle
- `README.md` - 完整的專案說明
- `.gitignore` - Git 忽略規則

---

## 📦 提交前的選擇

### 選項 A: 完整提交 (包含 node_modules 和編譯產物)

**適合**: 評審可以直接運行，無需安裝依賴

**檔案大小**: ~2.5 GB

**步驟**:
```bash
# 直接壓縮整個專案
cd /mnt/c/Users/tl/Desktop/
zip -r quantum-shield-hackathon.zip claude-test \
  -x "claude-test/.hackathon-backup/*" \
  -x "claude-test/.claude/*"
```

### 選項 B: 源碼提交 (不含編譯產物) ⭐ 推薦

**適合**: 標準的開源專案提交方式

**檔案大小**: ~50 MB

**步驟**:
```bash
cd /mnt/c/Users/tl/Desktop/claude-test

# 清理編譯產物
rm -rf quantum-shield-frontend/node_modules
rm -rf quantum-shield-frontend/.next
rm -rf rofl-kyc-oracle/target
rm -rf quantum-shield-contracts/cache
rm -rf quantum-shield-contracts/out

# 壓縮
cd ..
zip -r quantum-shield-hackathon-src.zip claude-test \
  -x "claude-test/.hackathon-backup/*" \
  -x "claude-test/.claude/*" \
  -x "claude-test/*/node_modules/*" \
  -x "claude-test/*/.next/*" \
  -x "claude-test/*/target/*" \
  -x "claude-test/*/cache/*" \
  -x "claude-test/*/out/*"
```

---

## 🔍 提交前檢查清單

運行以下命令確認沒有敏感資訊：

```bash
cd /mnt/c/Users/tl/Desktop/claude-test

# 1. 檢查沒有 .env 檔案 (應該只有 .env.example)
find . -name ".env" -not -name ".env.example" 2>/dev/null

# 2. 檢查沒有硬編碼的私鑰
grep -r "3ee6edd4924ecc36e054d049933f686b9e9442f2c29c567c1db13e538ff7c825" \
  quantum-shield-* rofl-kyc-oracle 2>/dev/null

# 3. 確認專案結構
ls -la

# 應該看到:
# - quantum-shield-frontend/
# - quantum-shield-contracts/
# - rofl-kyc-oracle/
# - README.md
# - .gitignore
# - .hackathon-backup/ (不會被壓縮)
```

---

## 📋 提交說明範本

### 專案名稱
**QuantumShield ROFL KYC Oracle**

### 一句話描述
基於 Oasis Sapphire 的後量子安全去中心化 KYC 驗證系統

### 專案簡介
QuantumShield 是一個創新的 KYC 驗證解決方案，結合了：
- **後量子密碼學** (Kyber1024) 保護用戶資料免受量子攻擊
- **ROFL 可信執行環境** 在鏈下安全處理敏感資料
- **Sapphire 智能合約** 提供隱私保護的鏈上驗證記錄

用戶的 KYC 資料在前端使用 Kyber1024 加密，只在 ROFL Oracle 的 TEE 中解密和驗證。驗證結果通過 ECDSA 簽名上鏈，原始資料永不觸及區塊鏈，實現真正的隱私保護。

### 技術棧
- **前端**: Next.js 14, TypeScript, Tailwind CSS, wagmi, viem
- **後端**: Rust, Axum, pqc_kyber
- **智能合約**: Solidity 0.8.24, Foundry
- **區塊鏈**: Oasis Sapphire Testnet
- **密碼學**: Kyber1024 (NIST PQC), ECDSA (secp256k1)

### 核心創新
1. **後量子安全**: 首個結合 Kyber1024 和 ROFL 的 KYC 解決方案
2. **零知識隱私**: 原始 KYC 資料不上鏈，只存驗證結果
3. **可信執行**: 利用 TEE 環境保護資料處理過程

### Demo 影片
[如果有的話]

### 部署連結
- 前端: [如果已部署]
- 合約: https://explorer.oasis.io/testnet/sapphire/address/0xe0e1EB1c77A0f280ADf74D09205f474d6bbbc3d2

### GitHub
[您的 GitHub 連結]

---

## 🚀 評審測試指南

評審可以按照 README.md 中的步驟運行專案：

### 快速測試 (5 分鐘)
1. 部署智能合約到 Sapphire Testnet
2. 啟動 ROFL Oracle
3. 啟動前端
4. 提交測試 KYC 資料
5. 查詢驗證狀態

### 完整測試 (15 分鐘)
- 檢查 Kyber1024 加密/解密
- 驗證 ECDSA 簽名
- 查看鏈上交易記錄
- 測試多個 KYC 提交

---

## 📧 聯絡資訊

如有問題，請聯絡：
- Email: [你的 Email]
- Discord: [你的 Discord]
- Telegram: [你的 Telegram]

---

## ✨ 最後提醒

1. ✅ 確認 `.env` 已刪除
2. ✅ 確認 `.env.example` 已創建
3. ✅ 確認 README.md 完整且清晰
4. ✅ 決定使用選項 A 或 B 進行壓縮
5. ✅ 運行檢查清單確認沒有敏感資訊
6. ✅ 準備好 Demo 影片或截圖

**Good luck! 🎉**
