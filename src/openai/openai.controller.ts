import { Controller, Post, Body } from '@nestjs/common';
import { OpenAIService } from './openai.service';

@Controller('openai')
export class OpenAIController {
  constructor(private readonly openaiService: OpenAIService) {}

  @Post('img-input')
  async imgInput(@Body('url') url: string): Promise<any> {
    return await this.openaiService.imgInput(url);
  }

  @Post('text-input')
  async textInput(@Body('text') text: string): Promise<any> {
    return await this.openaiService.textInput(text);
  }
}
