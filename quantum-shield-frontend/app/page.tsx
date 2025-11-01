'use client'

import { useState } from 'react'
import { useAccount, useConnect, useDisconnect, useReadContract } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { KYC_REGISTRY_ADDRESS, KYC_REGISTRY_ABI } from '@/lib/contracts'
import { keccak256, toBytes } from 'viem'
import { encryptKYCData } from '@/lib/kyber'

export default function Home() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    nationality: '',
    documentType: 'passport',
    documentNumber: '',
  })

  const [userHash, setUserHash] = useState<`0x${string}` | null>(null)
  const [verificationStatus, setVerificationStatus] = useState<string>('')
  const [queryStatus, setQueryStatus] = useState<string>('')
  const [hasQueried, setHasQueried] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [txHashFromROFL, setTxHashFromROFL] = useState<string>('')

  // Read verification status from contract
  const { data: isVerified, refetch: refetchVerification, isLoading: isQueryLoading, error: queryError } = useReadContract({
    address: KYC_REGISTRY_ADDRESS,
    abi: KYC_REGISTRY_ABI,
    functionName: 'isVerified',
    args: userHash ? [userHash] : undefined,
    query: {
      enabled: !!userHash,
    },
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmitKYC = async () => {
    if (!formData.fullName || !formData.birthDate || !formData.documentNumber) {
      alert('請填寫所有必填欄位')
      return
    }

    try {
      setIsSubmitting(true)

      // 1. Kyber 加密
      setVerificationStatus('🔐 正在用 Kyber768 加密資料...')
      const encryptedPackage = await encryptKYCData({
        full_name: formData.fullName,
        birth_date: formData.birthDate,
        nationality: formData.nationality,
        document_type: formData.documentType,
        document_number: formData.documentNumber,
      })
      console.log(`📦 Encrypted package: ${encryptedPackage.length} bytes`)

      // 2. 提交到 ROFL
      setVerificationStatus('📤 正在提交到 ROFL Oracle...')

      // 創建標準 ArrayBuffer 以避免 TypeScript 類型問題
      const buffer = new ArrayBuffer(encryptedPackage.length)
      const view = new Uint8Array(buffer)
      view.set(encryptedPackage)

      const response = await fetch('/api/rofl-verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        body: buffer,
      })

      if (!response.ok) {
        throw new Error('ROFL verification failed')
      }

      const data = await response.json()

      setVerificationStatus('✅ ROFL Oracle 已驗證並提交到區塊鏈！')
      setTxHashFromROFL(data.tx_hash)

      // 等待幾秒讓交易確認
      await new Promise(resolve => setTimeout(resolve, 3000))

      // 計算 userHash 以便查詢
      const hashInput = formData.fullName + formData.birthDate
      console.log('📊 Computing userHash:')
      console.log('   Full name:', formData.fullName)
      console.log('   Birth date:', formData.birthDate)
      console.log('   Combined input:', hashInput)

      const userHashValue = keccak256(
        toBytes(hashInput)
      )
      console.log('   Frontend userHash (keccak256):', userHashValue)
      setUserHash(userHashValue)

      setVerificationStatus(`交易已提交！查看下方交易哈希`)

    } catch (error) {
      console.error('KYC 提交失敗:', error)
      setVerificationStatus('錯誤: ' + (error as Error).message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCheckVerification = async () => {
    if (!userHash) {
      alert('請先提交 KYC')
      return
    }

    try {
      setQueryStatus('正在查詢區塊鏈...')
      setHasQueried(false)

      const result = await refetchVerification()

      setHasQueried(true)

      if (queryError) {
        setQueryStatus('查詢失敗: ' + queryError.message)
      } else {
        setQueryStatus('查詢完成')
        // Clear status after 2 seconds
        setTimeout(() => setQueryStatus(''), 2000)
      }
    } catch (error) {
      console.error('查詢錯誤:', error)
      setQueryStatus('查詢錯誤: ' + (error as Error).message)
      setHasQueried(true)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="container mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            QuantumShield KYC
          </h1>
          <p className="text-xl text-gray-700">
            Post-Quantum Secure KYC Verification on Oasis Sapphire
          </p>
          <div className="mt-6 inline-block px-4 py-2 bg-indigo-100 rounded-lg border border-indigo-300">
            <p className="text-sm text-indigo-800 font-medium">
              Powered by Kyber768 + ROFL TEE + Sapphire Confidential EVM
            </p>
          </div>
        </header>

        {/* Wallet Connection */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
            {!isConnected ? (
              <div className="text-center">
                <p className="text-gray-700 mb-4 font-medium">連接錢包以開始 KYC 驗證</p>
                <button
                  onClick={() => connect({ connector: injected() })}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all shadow-md"
                >
                  連接 MetaMask
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <p className="text-gray-600 text-sm mb-1">已連接地址</p>
                  <p className="text-gray-900 font-mono text-lg font-semibold">{address}</p>
                </div>
                <button
                  onClick={() => disconnect()}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-md"
                >
                  斷開連接
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        {isConnected && (
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* KYC Form */}
            <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">提交 KYC 文件</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">完整姓名</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">出生日期</label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">國籍</label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="USA"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">證件類型</label>
                  <select
                    name="documentType"
                    value={formData.documentType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="passport">護照</option>
                    <option value="id_card">身份證</option>
                    <option value="drivers_license">駕駛執照</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">證件號碼</label>
                  <input
                    type="text"
                    name="documentNumber"
                    value={formData.documentNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="A12345678"
                  />
                </div>

                <button
                  onClick={handleSubmitKYC}
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-semibold transition-all shadow-md mt-4"
                >
                  {isSubmitting ? '處理中...' : '提交 KYC 驗證'}
                </button>
              </div>

              {verificationStatus && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-300 rounded-lg">
                  <p className="text-blue-800 text-sm font-medium">{verificationStatus}</p>
                </div>
              )}
            </div>

            {/* Verification Status */}
            <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">驗證狀態</h2>

              {userHash && (
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-700 font-medium text-sm mb-1">用戶哈希值</p>
                    <p className="text-gray-900 font-mono text-xs break-all bg-gray-100 p-2 rounded border border-gray-300">
                      {userHash}
                    </p>
                  </div>

                  <button
                    onClick={handleCheckVerification}
                    disabled={isQueryLoading}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors shadow-md font-semibold"
                  >
                    {isQueryLoading ? '查詢中...' : '查詢驗證狀態'}
                  </button>

                  {queryStatus && (
                    <div className="p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
                      <p className="text-yellow-800 text-sm font-medium">{queryStatus}</p>
                    </div>
                  )}

                  {queryError && (
                    <div className="p-3 bg-red-50 border border-red-300 rounded-lg">
                      <p className="text-red-800 text-sm font-medium">
                        ⚠️ 錯誤：合約地址可能無效或網絡配置錯誤
                      </p>
                      <p className="text-red-700 text-xs mt-1">
                        請確認：
                        <br />1. MetaMask 已連接到 Sapphire Testnet (Chain ID: 23295)
                        <br />2. 合約已正確部署到該地址
                      </p>
                    </div>
                  )}

                  {hasQueried && !queryError && isVerified !== undefined && (
                    <div className={`p-4 rounded-lg border ${
                      isVerified
                        ? 'bg-green-50 border-green-300'
                        : 'bg-red-50 border-red-300'
                    }`}>
                      <p className={`font-semibold ${isVerified ? 'text-green-800' : 'text-red-800'}`}>
                        {isVerified ? '✓ KYC 驗證已通過' : '✗ KYC 驗證未通過或不存在'}
                      </p>
                    </div>
                  )}

                  {txHashFromROFL && (
                    <div className="mt-4">
                      <p className="text-gray-700 font-medium text-sm mb-1">交易哈希</p>
                      <a
                        href={`https://testnet.explorer.sapphire.oasis.io/tx/${txHashFromROFL}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-mono text-xs break-all underline"
                      >
                        {txHashFromROFL}
                      </a>
                    </div>
                  )}
                </div>
              )}

              {!userHash && (
                <div className="text-center py-12">
                  <p className="text-gray-500">提交 KYC 後查看驗證狀態</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">運作流程</h3>
            <ol className="space-y-2 text-gray-700">
              <li className="font-medium">1. 用戶填寫 KYC 資料並提交</li>
              <li className="font-medium">2. 前端使用 Kyber768 後量子加密演算法加密資料</li>
              <li className="font-medium">3. 加密資料傳送至 ROFL Oracle (TEE 可信執行環境)</li>
              <li className="font-medium">4. Oracle 在 TEE 中解密並驗證 KYC 資料</li>
              <li className="font-medium">5. Oracle 使用 ECDSA 簽名驗證結果</li>
              <li className="font-medium">6. 驗證結果提交至 Sapphire 智能合約</li>
              <li className="font-medium">7. 用戶可在鏈上查詢驗證狀態</li>
            </ol>
          </div>
        </div>
      </div>
    </main>
  )
}
