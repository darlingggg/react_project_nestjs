import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { TransformInterceptor } from './transform/transform.interceptor'
import { HttpExceptionFilter } from './http-exception/http-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api') // 全局的前缀

  app.useGlobalInterceptors(new TransformInterceptor()) // 全局拦截器 响应数据格式设置(成功)

  app.useGlobalFilters(new HttpExceptionFilter()) // 全局过滤器 错误信息的格式设置(失败)

  app.enableCors() // 允许跨域

  await app.listen(3300, '0.0.0.0') // 端口
  const url = await app.getUrl()
  console.log(`Application is running on: ${url}`)
}
void bootstrap()
