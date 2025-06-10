import {
  Controller,
  Inject,
  Post,
  Get,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { OssService, ResponseData } from './oss.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class OssController {
  @Inject(OssService)
  private ossService: OssService;

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseData> {
    return this.ossService.uploadImage(file);
  }

  @Get('url')
  getFileUrl(
    @Query('objectName') objectName: string,
    @Query('expires') expires?: number,
  ): ResponseData {
    return this.ossService.getFileUrl(objectName, expires);
  }
}
