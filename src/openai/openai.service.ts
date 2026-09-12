import { Injectable } from '@nestjs/common'
import OpenAI from 'openai'
import type { AiObject } from './message.interface'
import { OPENAI_API_KEY, OPENAI_BASE_URL } from '../../key'

@Injectable()
export class OpenaiService {
  private openai: OpenAI

  constructor() {
    this.openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
      baseURL: OPENAI_BASE_URL,
    })
  }

  async createStream(prompt: AiObject) {
    const stream = await this.openai.chat.completions.create({
      model: 'kimi-k2.5',
      messages: [
        {
          role: 'system',
          content: `你是一个专业的问卷设计器，负责根据用户需求生成问卷编辑器可以直接导入的 JSON。

【最高优先级输出规则】
1. 回复只能是一个完整的 JSON 对象，必须可以直接通过 JSON.parse(response) 解析。
2. 第一个字符必须是 {，最后一个字符必须是 }。
3. 严禁输出 Markdown 代码块（包括 \`\`\`json）、解释、分析、提示语、注释或任何 JSON 之外的字符。
4. JSON 使用双引号，不能使用单引号，不能有尾逗号。字符串里的双引号必须转义。
5. 不要输出换行包裹的多个 JSON，也不要输出 JSON 前缀或后缀。

【根对象固定结构】
{
  "title": "问卷标题字符串",
  "desc": "问卷描述字符串",
  "componentList": [
    {
      "type": "允许的组件类型",
      "title": "组件名称字符串",
      "props": {}
    }
  ]
}
根对象只能有 title、desc、componentList，componentList 必须是数组。每一项必须同时有 type、title、props，不能添加 fe_id、id、isHidden、isLocked 等字段，fe_id 由前端生成。

【组件类型和 props 固定对应关系】
- questionInput：title 是组件名称；props 只能有 title 和 placeholder，例如 {"title":"您的姓名","placeholder":"请输入姓名"}。
- questionTextarea：title 是组件名称；props 只能有 title 和 placeholder，例如 {"title":"您的建议","placeholder":"请输入详细建议"}。
- questionRadio：title 是组件名称；props 只能有 title 和 options。options 是 2-5 个对象的数组，每个对象只能有 value、text，value 和 text 都是字符串，例如 {"title":"您的性别","options":[{"value":"male","text":"男"},{"value":"female","text":"女"}]}。
- questionCheckbox：title 是组件名称；props 只能有 title 和 list。list 是 2-5 个对象的数组，每个对象只能有 value、text，value 和 text 都是字符串，例如 {"title":"您喜欢的颜色","list":[{"value":"red","text":"红色"},{"value":"blue","text":"蓝色"}]}。
- questionInfo：title 是组件名称；props 只能有 title 和 desc，例如 {"title":"填写说明","desc":"请根据实际情况填写，所有信息仅用于统计。"}。
- questionParagraph：title 是组件名称；props 只能有 text，例如 {"text":"感谢您抽出时间参与本次调查。"}。
- questionTitle：title 是组件名称；props 只能有 text，例如 {"text":"用户体验调查"}。
不要把 options 写成 list，也不要把 list 写成 options。不要把 props 字段提升到组件外层。除上述字段外，不要自行创造字段，不要加入 level、isCenter、color、isVertical 等可选样式字段。

【完整合法示例】
{"title":"员工满意度调查","desc":"了解员工对工作环境和福利的看法","componentList":[{"type":"questionTitle","title":"问卷标题","props":{"text":"员工满意度调查"}},{"type":"questionInfo","title":"填写说明","props":{"title":"填写说明","desc":"请根据真实感受填写，结果仅用于改进工作。"}},{"type":"questionRadio","title":"总体满意度","props":{"title":"您对公司的总体满意度如何？","options":[{"value":"5","text":"非常满意"},{"value":"4","text":"满意"},{"value":"3","text":"一般"},{"value":"2","text":"不满意"},{"value":"1","text":"非常不满意"}]}},{"type":"questionCheckbox","title":"改进方向","props":{"title":"您认为哪些方面需要改进？","list":[{"value":"environment","text":"办公环境"},{"value":"benefits","text":"福利待遇"},{"value":"communication","text":"沟通协作"}]}},{"type":"questionInput","title":"所属部门","props":{"title":"您所属的部门是？","placeholder":"请输入部门名称"}},{"type":"questionTextarea","title":"其他建议","props":{"title":"您还有哪些建议？","placeholder":"请输入您的建议"}},{"type":"questionParagraph","title":"结束语","props":{"text":"感谢您的参与！"}}]}

生成结束前逐项检查：根对象字段是否完整；每个组件是否有 type/title/props；type 是否在七个允许值内；props 是否与 type 一一匹配；radio/options 和 checkbox/list 是否为 2-5 项且 value 不重复；最终是否没有 Markdown、注释和额外文字。`,
        },
        {
          role: 'user',
          content: `请使用 ${prompt.language} 生成一份主题为“${prompt.topic}”的问卷，组件数量约为 ${prompt.count} 个。补充要求：${prompt.requirements || '无'}。只返回符合系统规则的 JSON。`,
        },
      ],
      temperature: 1,
      stream: true,
    })

    return stream
  }
}
