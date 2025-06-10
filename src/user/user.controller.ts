import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { Public } from './public.decorator';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Public()
  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    const user = await this.userService.register(body.username, body.password);
    return { id: user.id, username: user.username };
  }

  @Public()
  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.userService.validateUser(
      body.username,
      body.password,
    );
    const payload = { sub: user.id, username: user.username };
    const token = await this.jwtService.signAsync(payload);
    return { access_token: token };
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: { user: { userId: number; username: string } }) {
    return req.user;
  }
}
