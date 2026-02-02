import type { Memory } from '@super/shared/types'
import type { MemoryExtractor, ConversationContext, ExtractedMemory } from '../index'

interface LLMClient {
  chat(messages: Array<{ role: string; content: string }>): Promise<string>
}

/**
 * 使用 LLM 從對話中自動提取記憶
 */
export class LLMMemoryExtractor implements MemoryExtractor {
  private llm: LLMClient

  constructor(llm: LLMClient) {
    this.llm = llm
  }

  async extract(context: ConversationContext): Promise<ExtractedMemory[]> {
    const prompt = this.buildExtractionPrompt(context)

    const response = await this.llm.chat([
      { role: 'system', content: EXTRACTION_SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ])

    return this.parseResponse(response)
  }

  private buildExtractionPrompt(context: ConversationContext): string {
    const conversationText = context.messages
      .map((m) => `${m.role === 'user' ? '用戶' : 'AI'}: ${m.content}`)
      .join('\n')

    return `請分析以下對話，提取值得記住的資訊：

${conversationText}

請以 JSON 格式輸出提取的記憶。`
  }

  private parseResponse(response: string): ExtractedMemory[] {
    try {
      // 嘗試解析 JSON
      const jsonMatch = response.match(/\[[\s\S]*\]/)
      if (!jsonMatch) return []

      const parsed = JSON.parse(jsonMatch[0])

      return parsed.map((item: any) => ({
        type: this.normalizeType(item.type),
        content: item.content,
        confidence: item.confidence ?? 0.8,
        metadata: item.metadata,
      }))
    } catch {
      return []
    }
  }

  private normalizeType(type: string): Memory['type'] {
    const typeMap: Record<string, Memory['type']> = {
      fact: 'fact',
      事實: 'fact',
      preference: 'preference',
      偏好: 'preference',
      experience: 'experience',
      經驗: 'experience',
      relationship: 'relationship',
      關係: 'relationship',
    }

    return typeMap[type.toLowerCase()] ?? 'fact'
  }
}

const EXTRACTION_SYSTEM_PROMPT = `你是一個記憶提取專家。你的任務是從對話中識別並提取值得長期記住的資訊。

## 記憶類型

1. **fact（事實）**：關於用戶的客觀資訊
   - 姓名、職業、居住地
   - 技術棧、工作內容
   - 家庭成員、寵物

2. **preference（偏好）**：用戶的喜好和習慣
   - 編程語言偏好
   - 溝通風格偏好
   - 工作方式偏好

3. **experience（經驗）**：用戶分享的經歷
   - 過去的專案
   - 遇過的問題
   - 學習經歷

4. **relationship（關係）**：用戶提到的人物關係
   - 同事、朋友
   - 合作夥伴
   - 客戶

## 輸出格式

請以 JSON 陣列格式輸出，每個記憶包含：
- type: 記憶類型
- content: 記憶內容（簡潔的陳述句）
- confidence: 信心程度 (0-1)

範例：
\`\`\`json
[
  {
    "type": "fact",
    "content": "用戶是一名前端工程師",
    "confidence": 0.95
  },
  {
    "type": "preference",
    "content": "用戶偏好使用 TypeScript 而非 JavaScript",
    "confidence": 0.85
  }
]
\`\`\`

## 注意事項

1. 只提取有價值的長期記憶，忽略臨時性或無關緊要的資訊
2. 用第三人稱描述（「用戶...」而非「你...」）
3. 保持內容簡潔明確
4. 如果對話中沒有值得記住的資訊，返回空陣列 []
5. 不要捏造資訊，只提取對話中明確提到的內容`
