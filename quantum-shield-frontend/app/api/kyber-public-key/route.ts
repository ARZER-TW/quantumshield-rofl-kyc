import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch('http://127.0.0.1:8080/public-key')

    if (!response.ok) {
      throw new Error('Failed to fetch public key')
    }

    const data = await response.json()

    return NextResponse.json({
      publicKey: data.public_key
    })

  } catch (error) {
    console.error('Error fetching public key:', error)
    return NextResponse.json(
      { error: 'Failed to get public key' },
      { status: 500 }
    )
  }
}
