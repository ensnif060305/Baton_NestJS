import { Controller, Post, Body, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';
import { LoginDto } from './dto/login.dto';
import { TokenDto } from './dto/token.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
    this.authService = authService;
  }

  @Post('/createAcc')
  async createAcc(@Body() user: UserDto) {
    const data = await this.authService.createAcc(user);

    return Object.assign({
      data,
      statusCode: 201,
      statusMsg: '계정 생성 완료',
    });
  }

  @Post('/login')
  async login(@Body() login: LoginDto) {
    const data = await this.authService.login(login);

    return Object.assign({
      data,
      statusCode: 204,
      statusMsg: '',
    });
  }

  @Post('/logout')
  async logout(@Headers() tokenDto: TokenDto) {
    const data = await this.authService.logout(tokenDto);
    
    return Object.assign({
      data,
      statusCode: 204,
      statusMsg: '로그아웃 성공',
    });
  }
}
