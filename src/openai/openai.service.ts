import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

const prompt = `请识别图片中所有物品，
返回每个物品的英文单词[key为label]、中文含义[key为text]，以及该物品在图片中的矩形框坐标[key为coordinate]（格式为[x, y, width, height]，均为0-1之间的归一化比例，x/y为左上角）。
个数为5个，坐标尽量分散，不许重复。
只返回JSON数组格式严格按照[{{label: '', text:'', coordinate: [x,y,width,height]}}]，不要解释，不要其他无关信息。`;

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
      dangerouslyAllowBrowser: true,
    });
  }

  async imgInput(url: string) {
    const response = await this.openai.chat.completions.create({
      model: 'qwen-vl-max',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url },
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
    });

    return response;
  }

  async textInput(text: string) {
    const completion = await this.openai.chat.completions.create({
      model: 'qwen-plus', //此处以qwen-plus为例，可按需更换模型名称。模型列表：https://help.aliyun.com/zh/model-studio/getting-started/models
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: text },
      ],
    });
    return completion;
  }
}
