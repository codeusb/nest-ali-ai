/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Global, Module } from '@nestjs/common';
import * as Minio from 'minio';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { OssController } from './oss.controller';
import { OssService } from './oss.service';

@Global()
@Module({
  imports: [ConfigModule],
  controllers: [OssController],
  providers: [
    {
      provide: 'MINIO_CLIENT',
      useFactory(config: ConfigService) {
        const client = new Minio.Client({
          endPoint: config.get<string>('MINIO_ENDPOINT', 'localhost'),
          port: parseInt(config.get<string>('MINIO_PORT', '9000'), 10) || 9000,
          useSSL: config.get<string>('MINIO_USE_SSL', 'false') === 'true',
          accessKey: config.get<string>('MINIO_ACCESS_KEY', 'minioadmin'),
          secretKey: config.get<string>('MINIO_SECRET_KEY', 'minioadmin'),
        });
        return client;
      },
      inject: [ConfigService],
    },
    OssService,
  ],
  exports: ['MINIO_CLIENT'],
})
export class OssModule {}
