/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get, Query, Param, Patch, Body, Post, Delete, Request } from '@nestjs/common'
import { QuestionService } from './question.service'
import { Question } from './schemas/question.schema'
import { Public } from 'src/auth/decorators/public.decorator'

@Controller('question')
export class QuestionController {
  // 依赖注入
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  async create(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const { username = '' } = req.user
    return await this.questionService.create(username as string)
  }

  @Get()
  async findAll(
    @Query('keyword') keyword: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('isDeleted') isDeleted: boolean = false,
    @Query('isStar') isStar: boolean,
    @Request() req
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const { username } = req.user
    // 接受参数 前一个keyword的是query上的名称（http://xxx.xxx?keyword=xxx）后面的是自己定义的变量(后面的可变)
    const list = await this.questionService.findAllList({ keyword, page, pageSize, isDeleted, isStar, author: username })
    const count = await this.questionService.count({ keyword, isDeleted, isStar, author: username })
    return { list, count }
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    // 获取参数 前一个id是params上的名称（即:id的id）后面是定义的变量(后面的可变)
    return this.questionService.findOne(id)
  }

  @Patch(':id')
  updateOne(@Param('id') id: string, @Body() body: Question, @Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const { username = '' } = req.user
    return this.questionService.update(id, body, username as string)
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string, @Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const { username = '' } = req.user
    return this.questionService.delete(id, username as string)
  }

  @Delete()
  deleteMany(@Body() body, @Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const { username = '' } = req.user
    const { ids = [] } = body
    return this.questionService.deleteMany(ids as string[], username as string)
  }

  @Post('duplicate/:id')
  duplicate(@Param('id') id: string, @Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const { username = '' } = req.user
    return this.questionService.duplicate(id, username as string)
  }
}
