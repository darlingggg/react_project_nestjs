import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './schemas/user.schema'
import { Repository } from 'typeorm'
import { nanoid } from 'nanoid'

@Injectable()
export class UserService {
  // 依赖注入
  constructor(@InjectRepository(User) private readonly userModel: Repository<User>) {}

  async create(userData: Pick<User, 'username' | 'password' | 'nickname'>) {
    return await this.userModel.save(this.userModel.create({ ...userData, _id: nanoid(24) }))
  }

  async findOne(username: string, password: string) {
    return await this.userModel.findOne({ where: { username, password } })
  }
}
