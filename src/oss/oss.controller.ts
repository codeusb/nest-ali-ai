import {
  Controller,
  Inject,
  Post,
  Get,
  Query,
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
  uploadImage(@UploadedFile() file: Express.Multer.File): Promise<any> {
    return this.ossService.uploadImage(file);
  }

  @Get('url')
  getFileUrl(
    @Query('objectName') objectName: string,
    @Query('expires') expires?: number,
  ): any {
    return this.ossService.getFileUrl(objectName, expires);
  }
}
