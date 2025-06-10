import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AuthGuard } from './user/auth.guard';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 添加 CORS 支持
  app.enableCors({
    origin: 'http://localhost:5173', // 或者你的 React 应用运行的地址
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  });

  // 全局拦截器
  app.useGlobalInterceptors(new TransformInterceptor());

  // 全局异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  // 全局认证守卫
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new AuthGuard(reflector));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
