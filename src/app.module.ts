import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OssModule } from './oss/oss.module';
import { UserModule } from './user/user.module';
import { OpenAIModule } from './openai/openai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('MYSQL_HOST', 'localhost'),
        port: +config.get('MYSQL_PORT', 3306),
        username: config.get('MYSQL_USER', 'root'),
        password: config.get('MYSQL_PASSWORD', '12345678'),
        database: config.get('MYSQL_DATABASE', 'nest_demo'),
        autoLoadEntities: true,
        synchronize: true, // 生产环境建议关闭
      }),
    }),
    OssModule,
    UserModule,
    OpenAIModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
