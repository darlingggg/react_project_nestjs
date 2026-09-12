import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm'

@Entity('users')
export class User {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  _id: string

  @Column({ type: 'varchar', length: 100, unique: true })
  username: string

  @Column({ type: 'varchar', length: 255 })
  password: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  nickname?: string

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date
}
