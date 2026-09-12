import { Controller, Post, Body } from '@nestjs/common'
import { AnswerService } from './answer.service'
import { Answer } from './schema/answer.schema'
import { Public } from 'src/auth/decorators/public.decorator'

@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Public()
  @Post()
  async create(@Body() answerInfo: Answer) {
    return await this.answerService.create(answerInfo)
  }
}
