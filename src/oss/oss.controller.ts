import {
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { OssService } from './oss.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class OssController {
  @Inject(OssService)
  private ossService: OssService;

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.ossService.uploadImage(file);
  }
}
