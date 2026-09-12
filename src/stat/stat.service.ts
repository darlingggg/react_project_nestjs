import { Injectable } from '@nestjs/common'
import { QuestionService } from 'src/question/question.service'
import { AnswerService } from 'src/answer/answer.service'
import { Answer } from 'src/answer/schema/answer.schema'

@Injectable()
export class StatService {
  constructor(
    private readonly questionService: QuestionService,
    private readonly answerService: AnswerService
  ) {}

  _alterData = (answers: Answer, dataValueList: Array<{ fe_id: string; mapping: Array<{ value: string; text: string; checked?: boolean }> }>) => {
    const { answerList } = answers
    const list: object[] = []
    answerList.forEach(item => {
      const { componentId } = item
      const { value } = item
      let valueList: string[] = []
      const textList: string[] = []
      const obj: object = {}
      if (value) valueList = value.split(',')
      const fe_list = dataValueList.find(d => d.fe_id === componentId)
      if (fe_list) {
        valueList.forEach(v => {
          const valueMap = fe_list.mapping.find(m => m.value === v)
          if (valueMap) textList.push(valueMap.text)
        })
      }
      const alterValue = textList.join(',')
      obj[componentId] = alterValue || value
      list.push(obj)
    })
    return list
  }
  async getQuestionStatListAndCount(questionId: string, opt: { page: number; pageSize: number }) {
    const noData = { list: [], count: 0 }
    if (!questionId) return noData

    const q = await this.questionService.findOne(questionId)
    if (!q) return noData
    const { componentList } = q
    if (!componentList || componentList.length === 0) return noData
    const dataValueList: Array<{ fe_id: string; mapping: Array<{ value: string; text: string; checked?: boolean }> }> = []
    componentList.forEach(item => {
      if (item.type === 'questionRadio') {
        const props = item.props as { options: Array<{ value: string; text: string }> }
        dataValueList.push({ fe_id: item.fe_id, mapping: props.options })
      } else if (item.type === 'questionCheckbox') {
        const props = item.props as { list: Array<{ value: string; text: string; checked: boolean }> }
        dataValueList.push({ fe_id: item.fe_id, mapping: props.list })
      }
    })

    const total = await this.answerService.count(questionId)
    if (total === 0) return noData

    const answers = await this.answerService.findAll(questionId, opt)
    const list = answers.map(a => {
      const result = { _id: a._id }
      Object.assign(result, ...this._alterData(a, dataValueList))
      return result
    })
    return { list, total }
  }

  async getComponentStat(questionId: string, componentId: string) {
    if (!questionId || !componentId) return []

    const q = await this.questionService.findOne(questionId)
    if (!q) return []

    const { componentList } = q
    const comp = componentList.filter(item => item.fe_id === componentId)[0]
    if (!comp) return []

    const { type, props } = comp
    let options: Array<{ value: string; text: string }> = []
    if (type !== 'questionRadio' && type !== 'questionCheckbox') return []
    if (type === 'questionRadio') options = (props as { options: [] }).options
    else if (type === 'questionCheckbox') options = (props as { list: [] }).list

    const valueToText: object = {}
    if (options.length === 0) return []
    options.forEach(item => {
      valueToText[item.value] = item.text
    })

    const total = await this.answerService.count(questionId)
    if (total === 0) return []
    const answers = await this.answerService.findAll(questionId, { page: 1, pageSize: total })

    const countInfo = {}
    answers.forEach(a => {
      const { answerList = [] } = a
      answerList.forEach(answer => {
        if (answer.componentId !== componentId) return
        if (!answer.value) return
        answer.value.split(',').forEach(v => {
          if (!countInfo[v]) countInfo[v] = 0
          countInfo[v]++
        })
      })
    })

    const list: object[] = []
    for (const val in countInfo) {
      list.push({ name: valueToText[val] as string, count: countInfo[val] as number })
    }
    return list
  }

  async getCounts() {
    const { totalQuestions, totalPublished } = await this.questionService.AllCount()
    const totalAnswers = await this.answerService.AllCount()
    return { totalQuestions, totalPublished, totalAnswers }
  }
}
