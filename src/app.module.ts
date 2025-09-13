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
        type: 'better-sqlite3',
        database: config.get('SQLITE_DATABASE', 'database.sqlite'),
        autoLoadEntities: true,
        synchronize: true, // 生产环境建议关闭
        logging: config.get('NODE_ENV') === 'development',
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
