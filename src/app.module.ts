import {  Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './config/.env',
      isGlobal: true,
    }),
    UserModule,
    MongooseModule.forRoot(process.env.MONGO_URL as string, {
      onConnectionCreate: (connection: Connection) => {
        connection.on('connected', () => console.log('DB connected successfully😁'));
        // connection.on('open', () => console.log('open'));
        // connection.on('disconnected', () => console.log('disconnected'));
        // connection.on('reconnected', () => console.log('reconnected'));
        // connection.on('disconnecting', () => console.log('disconnecting'));

        return connection;
      },
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  
}
