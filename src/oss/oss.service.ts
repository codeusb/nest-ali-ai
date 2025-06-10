import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import OSS from 'ali-oss';

export interface ResponseData<T = unknown> {
  code: number;
  message: string;
  data?: T;
}

@Injectable()
export class OssService {
  @Inject('OSS_CLIENT')
  private ossClient: OSS;

  private createResponse(
    code: number,
    message: string,
    data?: any,
  ): ResponseData {
    return {
      code,
      message,
      data,
    };
  }

  // 生成签名URL
  private getSignedUrl(objectName: string, expires: number = 3600): string {
    try {
      const url = this.ossClient.signatureUrl(objectName, {
        expires, // URL 有效期，单位秒，默认1小时
        method: 'GET', // 请求方法
      });
      return url;
    } catch (error) {
      throw new HttpException(
        this.createResponse(500, '生成签名URL失败', error),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async uploadImage(file: Express.Multer.File) {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      throw new BadRequestException(this.createResponse(400, '只能上传图片'));
    }
    // 检查文件大小 5MB
    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException(
        this.createResponse(400, '文件大小不能超过5MB！'),
      );
    }
    try {
      // 生成唯一的文件名
      const fileName = `${Date.now()}-${file.originalname}`;
      const res = await this.ossClient.put(fileName, file.buffer);

      if (res) {
        // 生成签名URL
        const signedUrl = this.getSignedUrl(fileName);

        return this.createResponse(200, '上传成功', {
          url: signedUrl,
          name: fileName,
          size: file.size,
          type: file.mimetype,
          // 添加原始文件名，方便前端显示
          originalName: file.originalname,
        });
      }
      throw new HttpException(
        this.createResponse(400, '上传失败'),
        HttpStatus.BAD_REQUEST,
      );
    } catch (error) {
      throw new HttpException(
        this.createResponse(500, '上传失败', error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 获取文件签名URL的方法
  getFileUrl(objectName: string, expires: number = 3600) {
    try {
      const signedUrl = this.getSignedUrl(objectName, expires);
      return this.createResponse(200, '获取URL成功', {
        url: signedUrl,
        expires, // 返回URL的有效期
      });
    } catch (error) {
      throw new HttpException(
        this.createResponse(500, '获取URL失败', error),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
