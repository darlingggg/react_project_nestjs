import { Body, Controller, Post, HttpException, HttpStatus, Get, Redirect } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/user.dto'
import { Public } from 'src/auth/decorators/public.decorator'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('register')
  async register(@Body() userDto: CreateUserDto) {
    try {
      return await this.userService.create(userDto)
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : String(err)
      throw new HttpException(errMessage, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('info')
  @Redirect('/api/auth/profile', 302) // GET http 状态码 301 永久转发(发送过一次之后以后直接进行转发到目的地址，之后要更改的话可能不好改) 302 临时转发
  info() {
    return
  }

  @Public()
  @Post('login')
  @Redirect('/api/auth/login', 307) // POST 307 临时转发 308 永久转发
  login() {
    return
  }
}
