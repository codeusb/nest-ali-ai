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
        const client = new OSS({
          region: config.get('OSS_REGION') as string,
          bucket: config.get('OSS_BUCKET') as string,
          accessKeyId: config.get('OSS_ACCESS_KEY_ID') as string,
          accessKeySecret: config.get('OSS_ACCESS_KEY_SECRECT') as string,
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
