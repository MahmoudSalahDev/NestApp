/* eslint-disable */
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from 'src/DB/Models/user.model';
import { RevokeTokenRepository } from 'src/DB/repos/revokeToken.repository';
import { RevokeToken, RevokeTokenSchema } from 'src/DB/Models/revokeToken';
import { UserRepo } from 'src/DB';
import { TokenService } from 'src/utils/token';
import { JwtModule } from '@nestjs/jwt';
// import { AuthenticationMiddleware, tokenType } from 'src/common/middleware';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RevokeToken.name, schema: RevokeTokenSchema },
    ]),
    JwtModule.register({
      global: true, // 👈 makes JwtService available everywhere
      secret: process.env.ACCESS_TOKEN_USER || 'defaultSecret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepo,
    RevokeTokenRepository,
    TokenService, 
  ],
  exports: [
    UserRepo,
    RevokeTokenRepository,
    TokenService, 
  ],
})
export class UserModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(tokenType(),AuthenticationMiddleware)
  //     .forRoutes(
  //       {path:'users/profile',method:RequestMethod.ALL}
  //     );
  // }
}
