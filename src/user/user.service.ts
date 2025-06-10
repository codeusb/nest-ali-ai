import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(username: string, password: string): Promise<User> {
    const exist = await this.userRepository.findOne({ where: { username } });
    if (exist) {
      throw new ConflictException('用户名已存在');
    }
    const hash = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ username, password: hash });
    return this.userRepository.save(user);
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { username } });
    return user ?? undefined;
  }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.findByUsername(username);
    if (!user) throw new NotFoundException('用户不存在');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('密码错误');
    return user;
  }
}
