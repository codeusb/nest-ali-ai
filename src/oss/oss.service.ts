import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import OSS from 'ali-oss';

@Injectable()
export class OssService {
  @Inject('OSS_CLIENT')
  private ossClient: OSS;

  async uploadImage(file: Express.Multer.File) {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      throw new BadRequestException('只能上传图片');
    }
    // 检查文件大小 5MB
    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('文件大小不能超过5MB！');
    }
    try {
      const res = await this.ossClient.put(file.originalname, file.buffer);
      if (res) return res.url;
      throw new HttpException('上传失败', HttpStatus.BAD_REQUEST);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
