import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Question } from './schemas/question.schema'
import { Repository, Like, In, FindOptionsWhere } from 'typeorm'
import { nanoid } from 'nanoid'
import { AnswerService } from 'src/answer/answer.service'

@Injectable()
export class QuestionService {
  // 依赖注入
  constructor(
    @InjectRepository(Question) private readonly questionModel: Repository<Question>,
    private readonly answerService: AnswerService
  ) {}

  async create(username: string) {
    const question = this.questionModel.create({
      _id: nanoid(24),
      title: '问卷标题' + Date.now(),
      desc: '问卷描述',
      author: username,
      createdAt: new Date(),
      componentList: [
        {
          fe_id: nanoid(),
          type: 'questionInfo',
          title: '问卷信息',
          props: { title: '问卷标题', desc: '问卷描述...' },
        },
      ],
    })
    return await this.questionModel.save(question)
  }

  async delete(id: string, author: string) {
    const question = await this.questionModel.findOne({ where: { _id: id, author } })
    return question ? await this.questionModel.remove(question) : null
  }

  async deleteMany(ids: string[], author: string) {
    return await this.questionModel.delete({ _id: In(ids), author })
  }

  async findOne(id: string) {
    return await this.questionModel.findOne({ where: { _id: id } })
  }

  async update(id: string, updateData: Question, author: string) {
    return await this.questionModel.update({ _id: id, author }, updateData)
  }

  async findAllList({ keyword = '', page = 1, pageSize = 10, isDeleted = false, isStar, author = '' }) {
    const whereOpt: FindOptionsWhere<Question> = { author, isDeleted }
    if (isStar !== undefined) whereOpt.isStar = isStar as boolean
    if (keyword) whereOpt.title = Like(`%${keyword}%`)
    const answers = await this.answerService.getAll()
    const map = new Map()
    answers.forEach(item => {
      if (map.has(item.questionId)) {
        map.set(item.questionId, map.get(item.questionId) + 1)
      } else {
        map.set(item.questionId, 1)
      }
    })
    const res = await this.questionModel.find({ where: whereOpt, order: { createdAt: 'DESC' }, skip: (page - 1) * pageSize, take: pageSize })
    res.forEach(item => {
      const id = item._id.toString()
      item.answerCount = (map.get(id) as number) || 0
    })
    return res
  }

  async count({ keyword = '', isDeleted = false, isStar, author = '' }) {
    const whereOpt: FindOptionsWhere<Question> = { author, isDeleted }
    if (isStar !== undefined) whereOpt.isStar = isStar as boolean
    if (keyword) {
      whereOpt.title = Like(`%${keyword}%`)
    }
    return await this.questionModel.count({ where: whereOpt })
  }

  async duplicate(id: string, author: string) {
    const question = await this.questionModel.findOne({ where: { _id: id } })
    if (!question) return null
    const newQuestion = this.questionModel.create({
      ...question,
      _id: nanoid(24),
      title: question.title + ' 副本',
      author,
      isPublished: false,
      isStar: false,
      componentList: question.componentList.map(item => {
        return { ...item, fe_id: nanoid() }
      }),
    })
    return await this.questionModel.save(newQuestion)
  }

  async AllCount() {
    const totalQuestions = await this.questionModel.count()
    const totalPublished = await this.questionModel.count({ where: { isPublished: true } })
    return { totalQuestions, totalPublished }
  }
}
