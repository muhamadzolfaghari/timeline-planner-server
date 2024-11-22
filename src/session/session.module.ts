import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { Session } from './entities/session.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionController } from './session.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Session])],
  providers: [SessionService],
  controllers: [SessionController],
  exports: [TypeOrmModule],
})
export class SessionModule {}
