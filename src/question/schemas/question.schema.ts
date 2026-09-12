import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type QuestionDocument = HydratedDocument<Question>

@Schema()
export class Question {
  @Prop({ required: true })
  title: string

  @Prop()
  desc: string

  @Prop()
  js: string

  @Prop()
  css: string

  @Prop({ default: false })
  isPublished: boolean

  @Prop({ default: false })
  isDeleted: boolean

  @Prop({ default: false })
  isStar: boolean

  @Prop({ required: true })
  author: string

  @Prop({ default: 0 })
  answerCount: number

  @Prop()
  createdAt: Date

  @Prop()
  componentList: {
    fe_id: string
    type: string
    title: string
    isHidden: boolean
    isLocked: boolean
    props: object
  }[]
}

export const QuestionSchema = SchemaFactory.createForClass(Question)
