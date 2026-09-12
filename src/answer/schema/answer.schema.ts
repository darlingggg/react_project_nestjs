import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm'

@Entity('answers')
export class Answer {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  _id: string

  @Column({ type: 'varchar', length: 64 })
  questionId: string

  @Column({ type: 'json', nullable: true })
  answerList: {
    componentId: string
    value: string
  }[]

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date
}
