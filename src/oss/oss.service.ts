/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import * as Minio from 'minio';

@Injectable()
export class OssService {
  @Inject('MINIO_CLIENT')
  private minioClient: Minio.Client;

  // 生成签名URL
  private async getSignedUrl(
    objectName: string,
    expires: number = 3600,
  ): Promise<string> {
    try {
      const bucketName = process.env.MINIO_BUCKET || 'nest-ali-ai';
      const url = await this.minioClient.presignedGetObject(
        bucketName,
        objectName,
        expires,
      );
      return url;
    } catch {
      throw new HttpException(
        '生成签名URL失败',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async uploadImage(file: Express.Multer.File) {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      throw new BadRequestException('只能上传图片');
    }
    // 检查文件大小 5MB
    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('文件大小不能超过5MB！');
    }
    try {
      const bucketName = process.env.MINIO_BUCKET || 'nest-ali-ai';
      console.log('bucketName', bucketName);
      // 确保存储桶存在
      const bucketExists = await this.minioClient.bucketExists(bucketName);
      if (!bucketExists) {
        console.log('bucketExists', bucketExists);
        await this.minioClient.makeBucket(bucketName, 'us-east-1');
      }

      // 生成唯一的文件名
      const fileName = `${Date.now()}-${file.originalname}`;
      const res = await this.minioClient.putObject(
        bucketName,
        fileName,
        file.buffer,
        file.size,
        {
          'Content-Type': file.mimetype,
        },
      );

      if (res) {
        // 生成签名URL
        const signedUrl = await this.getSignedUrl(fileName);

        return {
          url: signedUrl,
          name: fileName,
          size: file.size,
          type: file.mimetype,
          // 添加原始文件名，方便前端显示
          originalName: file.originalname,
        };
      }
      throw new HttpException('上传失败', HttpStatus.BAD_REQUEST);
    } catch (error) {
      console.error('Upload error:', error);
      throw new HttpException('上传失败', HttpStatus.BAD_REQUEST);
    }
  }

  // 获取文件签名URL的方法
  async getFileUrl(objectName: string, expires: number = 3600) {
    try {
      const signedUrl = await this.getSignedUrl(objectName, expires);
      return {
        url: signedUrl,
        expires, // 返回URL的有效期
      };
    } catch {
      throw new HttpException('获取URL失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
