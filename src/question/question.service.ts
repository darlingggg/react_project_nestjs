import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Question } from './schemas/question.schema'
import mongoose, { FilterQuery, Model } from 'mongoose'
import { nanoid } from 'nanoid'
import { AnswerService } from 'src/answer/answer.service'

@Injectable()
export class QuestionService {
  // 依赖注入
  constructor(
    @InjectModel(Question.name) private readonly questionModel: Model<Question>,
    private readonly answerService: AnswerService
  ) {}

  async create(username: string) {
    const question = new this.questionModel({
      title: '问卷标题' + Date.now(),
      desc: '问卷描述',
      author: username,
      createdAt: Date.now(),
      componentList: [
        {
          fe_id: nanoid(),
          type: 'questionInfo',
          title: '问卷信息',
          props: { title: '问卷标题', desc: '问卷描述...' },
        },
      ],
    })
    return await question.save()
  }

  async delete(id: string, author: string) {
    return await this.questionModel.findOneAndDelete({ _id: id, author })
  }

  async deleteMany(ids: string[], author: string) {
    return await this.questionModel.deleteMany({ _id: { $in: ids }, author })
  }

  async findOne(id: string) {
    return await this.questionModel.findById(id)
  }

  async update(id: string, updateData: Question, author: string) {
    return await this.questionModel.updateOne({ _id: id, author }, updateData)
  }

  async findAllList({ keyword = '', page = 1, pageSize = 10, isDeleted = false, isStar, author = '' }) {
    const whereOpt: FilterQuery<Question> = { author, isDeleted }
    if (isStar !== undefined) whereOpt.isStar = isStar as boolean

    if (keyword) {
      const reg = new RegExp(keyword, 'i')
      whereOpt.title = { $regex: reg } // 模糊搜索
    }
    const answers = await this.answerService.getAll()
    const map = new Map()
    answers.forEach(item => {
      if (map.has(item.questionId)) {
        map.set(item.questionId, map.get(item.questionId) + 1)
      } else {
        map.set(item.questionId, 1)
      }
    })
    const res = await this.questionModel
      .find(whereOpt)
      .sort({ _id: -1 }) // 根据_id进行降序排序(从大到小)
      .skip((page - 1) * pageSize) // 跳过前 (page-1)*pageSize条数据
      .limit(pageSize) // 限制返回条数
    res.forEach(item => {
      const id = item._id.toString()
      item.answerCount = (map.get(id) as number) || 0
    })
    return res
  }

  async count({ keyword = '', isDeleted = false, isStar, author = '' }) {
    const whereOpt: FilterQuery<Question> = { author, isDeleted }
    if (isStar !== undefined) whereOpt.isStar = isStar as boolean
    if (keyword) {
      const reg = new RegExp(keyword, 'i')
      whereOpt.title = { $regex: reg } // 模糊搜索
    }
    return await this.questionModel.countDocuments(whereOpt)
  }

  async duplicate(id: string, author: string) {
    const question = await this.questionModel.findById(id)
    if (!question) return null
    const newQuestion = new this.questionModel({
      ...question.toObject(),
      _id: new mongoose.Types.ObjectId(),
      title: question.title + ' 副本',
      author,
      isPublished: false,
      isStar: false,
      componentList: question.componentList.map(item => {
        return { ...item, fe_id: nanoid() }
      }),
    })
    return await newQuestion.save()
  }

  async AllCount() {
    const totalQuestions = await this.questionModel.countDocuments()
    const totalPublished = await this.questionModel.countDocuments({ isPublished: true })
    return { totalQuestions, totalPublished }
  }
}
