// src/openai/message.interface.ts
export interface Message {
  data: {
    content: string
    error?: string
  }
}

export interface AiObject {
  language: string
  count: number
  topic: string
  requirements: string
}
