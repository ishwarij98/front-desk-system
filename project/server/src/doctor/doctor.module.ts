import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './doctor.entity';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor])], // Enable TypeORM for Doctor entity
  controllers: [DoctorController],
  providers: [DoctorService],
})
export class DoctorModule {}
