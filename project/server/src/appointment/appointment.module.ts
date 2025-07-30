import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './appointment.entity';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { QueueModule } from '../queue/queue.module'; // ✅ Needed for adding patient to queue

@Module({
  imports: [
    // Register Appointment entity with TypeORM
    TypeOrmModule.forFeature([Appointment]),
    // Import QueueModule so we can use QueueService inside AppointmentService
    QueueModule,
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService], // (Optional) if used elsewhere
})
export class AppointmentModule {}
