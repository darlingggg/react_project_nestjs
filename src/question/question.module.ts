import { Module } from '@nestjs/common'
import { QuestionController } from './question.controller'
import { QuestionService } from './question.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Question } from './schemas/question.schema'
import { AnswerModule } from 'src/answer/answer.module'

@Module({
  imports: [TypeOrmModule.forFeature([Question]), AnswerModule],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService],
})
export class QuestionModule {}
