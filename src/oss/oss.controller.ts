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
import { Public } from 'src/user/public.decorator';

@Controller('upload')
export class OssController {
  @Inject(OssService)
  private ossService: OssService;

  @Post('image')
  @Public()
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.Multer.File): Promise<any> {
    return this.ossService.uploadImage(file);
  }

  @Get('url')
  @Public()
  getFileUrl(
    @Query('objectName') objectName: string,
    @Query('expires') expires?: number,
  ): Promise<any> {
    return this.ossService.getFileUrl(objectName, expires);
  }
}
