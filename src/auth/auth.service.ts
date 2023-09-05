import { Injectable, UnauthorizedException, UseFilters } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpExceptionFilter } from 'src/http.exception.fiter/http.exception.filter';
import { AuthEntity } from './entity/auth.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { Repository } from 'typeorm';
import { ConflictException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserDto } from './dto/user.dto';
import { TokenDto } from './dto/token.dto';
import { TokenResultDto } from './dto/tokenResult.dto';

@UseFilters(new HttpExceptionFilter())
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthEntity) private authEntity: Repository<AuthEntity>,
    @InjectRedis() private readonly redis: Redis,
    private readonly jwt: JwtService,
    private config: ConfigService,
  ) {
    this.authEntity = authEntity;
  }

  async createAcc(user: UserDto): Promise<object> {
    const { username, nickname, email, password } = user;

    if (await this.authEntity.findOneBy({ username }))
      throw new ConflictException('아이디 중복');
    if (await this.authEntity.findOneBy({ nickname }))
      throw new ConflictException('전화번호 중복');
    if (await this.authEntity.findOneBy({ email }))
      throw new ConflictException('이메일 중복');

    if (!password.match('^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,}$'))
      throw new ConflictException('비밀번호 규칙에 맞지 않음');

    const newUser = await this.authEntity.save({
      username,
      nickname,
      email,
      password,
    });

    return newUser;
  }

  async login(loginDto: LoginDto): Promise<object> {
    const { email, password } = loginDto;

    const thisUser = await this.authEntity.findOneBy({ email });

    if (!(password == thisUser.password)) throw new ConflictException();
    
    const access = await this.generateAccessToken(
      thisUser.userID,
      thisUser.nickname,
    );
    const refresh = await this.generateRefreshToken(
      thisUser.userID,
      thisUser.nickname,
    );

    await this.redis.set(`${thisUser.userID}AccessToken`, access);
    await this.redis.set(`${thisUser.userID}RefreshToken`, refresh);

    return {
      accessToken: access,
      refreshToken: refresh,
    };
  }
  
  async logout(token: TokenDto): Promise<string> {
    const { userID } = await this.validateAccess(token);

    const userAccessToken = await this.redis.get(`${userID}AccessToken`);
    
    if (!userAccessToken) {
      throw new UnauthorizedException('Already logged out')
    }

    await this.redis.del(`${userID}AccessToken`);
    await this.redis.del(`${userID}RefreshToken`)
    
    return `User with ID ${userID} successfully logged out`;
}


  
  async generateAccessToken(userID: number, nickname: string) {
    const payload = {
      userID,
      nickname,
    };

    const access = await this.jwt.sign(payload, {
      secret: this.config.get<string>('process.env.JWT_SECRET_ACCESS'),
    });

    return `Bearer ${access}`;
  }

  async generateRefreshToken(userID: number, nickname: string) {
    const payload = {
      userID,
      nickname,
    };

    const refresh = await this.jwt.sign(payload, {
      secret: this.config.get<string>('process.env.JWT_SECRET_REFRESH'),
      expiresIn: '7d',
    });

    return `Bearer ${refresh}`;
  }

  async validateAccess(tokenDto: TokenDto): Promise<TokenResultDto> {
    if (!tokenDto.accesstoken) {
      throw new UnauthorizedException('Invalid or expired access token')
    }
    const accesstoken = tokenDto.accesstoken.split(' ')[1];

    let access: TokenResultDto;
    try {
      access = await this.jwt.verifyAsync(accesstoken, {
        secret: this.config.get<string>('process.env.JWT_SECRET_ACCESS'),
      });

    } catch (e) {
      // Access token is invalid or expired
      throw new UnauthorizedException('Invalid or expired access token');
    }

    if (!access) throw new UnauthorizedException('No valid access token found');

    const userAccessToken = await this.redis.get(`${access.userID}AccessToken`);
    
    if (userAccessToken !== accesstoken) {
      throw new UnauthorizedException('Already logged out')
    }
    return access;
}


}
