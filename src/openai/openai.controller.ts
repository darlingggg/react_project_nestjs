// src/openai/openai.controller.ts
import { Controller, Query, Sse } from '@nestjs/common'
import { Observable } from 'rxjs'
import { OpenaiService } from './openai.service'
import type { Message, AiObject } from './message.interface'
import { Public } from 'src/auth/decorators/public.decorator'

@Public()
@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}
  @Sse()
  async streamSse(@Query('prompt') prompt: string): Promise<Observable<Message>> {
    const prompt_obj = JSON.parse(decodeURIComponent(prompt)) as AiObject
    console.log(prompt_obj)
    const stream = await this.openaiService.createStream(prompt_obj)

    return new Observable(subscriber => {
      void (async () => {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || ''
            if (content) {
              subscriber.next({
                data: { content },
              })
            }
          }
          subscriber.complete()
        } catch (error) {
          subscriber.error(error)
        }
      })()
    })
  }
}
