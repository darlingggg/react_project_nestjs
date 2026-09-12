import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Answer } from './schema/answer.schema'
import { Model } from 'mongoose'

@Injectable()
export class AnswerService {
  // 依赖注入
  constructor(@InjectModel(Answer.name) private readonly answerModel: Model<Answer>) {}

  // 创建答卷
  async create(answerInfo: Answer) {
    if (answerInfo.questionId == null) {
      throw new HttpException('缺少问卷id', HttpStatus.BAD_REQUEST)
    }

    const answer = new this.answerModel(answerInfo)
    return await answer.save()
  }

  // 获取答卷数量
  async count(questionId: string) {
    if (!questionId) return 0
    return await this.answerModel.countDocuments({ questionId })
  }

  async findAll(questionId: string, opt: { page: number; pageSize: number }) {
    if (!questionId) return []
    const { page = 1, pageSize = 10 } = opt
    return await this.answerModel
      .find({ questionId })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 })
  }

  async getAll() {
    return await this.answerModel.find()
  }

  async AllCount() {
    return await this.answerModel.countDocuments()
  }
}
