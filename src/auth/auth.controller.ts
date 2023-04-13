import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredsDto } from './dto/auth-creds.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() cred: AuthCredsDto) {
    return this.authService.signUp(cred);
  }

  @Post('/login')
  async loginUser(
    @Body() cred: AuthCredsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(cred);
  }
}
