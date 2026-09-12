import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm'

@Entity('questions')
export class Question {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  _id: string

  @Column({ type: 'varchar', length: 255 })
  title: string

  @Column({ type: 'text', nullable: true })
  desc: string

  @Column({ type: 'text', nullable: true })
  js: string

  @Column({ type: 'text', nullable: true })
  css: string

  @Column({ type: 'boolean', default: false })
  isPublished: boolean

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean

  @Column({ type: 'boolean', default: false })
  isStar: boolean

  @Column({ type: 'varchar', length: 100 })
  author: string

  @Column({ type: 'int', default: 0 })
  answerCount: number

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date

  @Column({ type: 'json', nullable: true })
  componentList: {
    fe_id: string
    type: string
    title: string
    isHidden: boolean
    isLocked: boolean
    props: object
  }[]
}
