import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { QuestionModule } from './question/question.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { AnswerModule } from './answer/answer.module'
import { StatModule } from './stat/stat.module'
import { OpenaiModule } from './openai/openai.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    QuestionModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST || '127.0.0.1',
      port: Number(process.env.MYSQL_PORT || 3306),
      username: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '123456',
      database: process.env.MYSQL_DATABASE || 'react_nestdb',
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
      charset: 'utf8mb4',
    }),
    UserModule,
    AuthModule,
    AnswerModule,
    StatModule,
    OpenaiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
