import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DoctorModule } from './doctor/doctor.module';
import { QueueModule } from './queue/queue.module';
import { AppointmentModule } from './appointment/appointment.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'frontdesk',
      autoLoadEntities: true,
      synchronize: true, // DO NOT use in production
    }),
    UserModule,
    AuthModule,
    DoctorModule,
    QueueModule,
    AppointmentModule,
  ],
})
export class AppModule {}
