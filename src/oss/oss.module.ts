import { Global, Module } from '@nestjs/common';
import * as OSS from 'ali-oss';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { OssController } from './oss.controller';
import { OssService } from './oss.service';

@Global()
@Module({
  imports: [ConfigModule],
  controllers: [OssController],
  providers: [
    {
      provide: 'OSS_CLIENT',
      useFactory(config: ConfigService) {
        const client = new OSS.default({
          region: config.get<string>('OSS_REGION')!,
          bucket: config.get<string>('OSS_BUCKET')!,
          accessKeyId: config.get<string>('OSS_ACCESS_KEY_ID')!,
          accessKeySecret: config.get<string>('OSS_ACCESS_KEY_SECRECT')!,
        });
        return client;
      },
      inject: [ConfigService],
    },
    OssService,
  ],
  exports: ['OSS_CLIENT'],
})
export class OssModule {}
