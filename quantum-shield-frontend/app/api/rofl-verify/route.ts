import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('📥 Received encrypted KYC data')

    // 接收二進制加密資料
    const encryptedData = await request.arrayBuffer()
    console.log(`   Size: ${encryptedData.byteLength} bytes`)

    // 轉發到 ROFL
    console.log('📤 Forwarding to ROFL Oracle...')
    const roflResponse = await fetch('http://127.0.0.1:8080/verify-kyc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      body: encryptedData,
    })

    if (!roflResponse.ok) {
      const errorText = await roflResponse.text()
      console.error('❌ ROFL error:', errorText)
      throw new Error(`ROFL verification failed: ${errorText}`)
    }

    const result = await roflResponse.json()
    console.log('✅ ROFL verification successful')

    return NextResponse.json(result)

  } catch (error) {
    console.error('❌ Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Verification failed' },
      { status: 500 }
    )
  }
}
