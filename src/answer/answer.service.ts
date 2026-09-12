import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Answer } from './schema/answer.schema'
import { Repository } from 'typeorm'
import { nanoid } from 'nanoid'

@Injectable()
export class AnswerService {
  // 依赖注入
  constructor(@InjectRepository(Answer) private readonly answerModel: Repository<Answer>) {}

  // 创建答卷
  async create(answerInfo: Answer) {
    if (answerInfo.questionId == null) {
      throw new HttpException('缺少问卷id', HttpStatus.BAD_REQUEST)
    }

    return await this.answerModel.save(this.answerModel.create({ ...answerInfo, _id: nanoid(24) }))
  }

  // 获取答卷数量
  async count(questionId: string) {
    if (!questionId) return 0
    return await this.answerModel.count({ where: { questionId } })
  }

  async findAll(questionId: string, opt: { page: number; pageSize: number }) {
    if (!questionId) return []
    const { page = 1, pageSize = 10 } = opt
    return await this.answerModel.find({ where: { questionId }, skip: (page - 1) * pageSize, take: pageSize, order: { createdAt: 'DESC' } })
  }

  async getAll() {
    return await this.answerModel.find()
  }

  async AllCount() {
    return await this.answerModel.count()
  }
}
