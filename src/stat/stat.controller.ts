import { Controller, Get, Param, Query } from '@nestjs/common'
import { StatService } from './stat.service'
import { Public } from 'src/auth/decorators/public.decorator'

@Controller('stat')
export class StatController {
  constructor(private readonly statService: StatService) {}

  @Public()
  @Get()
  async getCounts() {
    return await this.statService.getCounts()
  }

  @Get(':questionId')
  async getQuestionStatListAndCount(
    @Param('questionId') questionId: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10
  ) {
    return await this.statService.getQuestionStatListAndCount(questionId, { page, pageSize })
  }

  @Get(':questionId/:componentId')
  async getComponentStat(@Param('questionId') questionId: string, @Param('componentId') componentId: string) {
    const stat = await this.statService.getComponentStat(questionId, componentId)
    return { stat }
  }
}
