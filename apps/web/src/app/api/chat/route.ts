import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    // TODO: 整合真實的 LLM API
    // 目前返回模擬回應
    const lastMessage = messages[messages.length - 1]

    // 模擬延遲
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      content: `這是對「${lastMessage.content}」的回應。\n\n請在環境變數中設定 ANTHROPIC_API_KEY 或 OPENAI_API_KEY 以啟用 AI 功能。`,
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
