import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DoctorModule } from './doctor/doctor.module';
import { QueueModule } from './queue/queue.module';
import { AppointmentModule } from './appointment/appointment.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        type: 'mysql' as const,
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '',
        database: 'frontdesk',
        autoLoadEntities: true,   // ✅ This is valid in NestJS
        synchronize: true,        // DO NOT use in production
      }),
      dataSourceFactory: async (options) => {
        // `options` here is NOT MysqlConnectionOptions, it's Nest's config type
        const dataSource = new DataSource(options as any); // cast to avoid TS error
        await dataSource.initialize();
        console.log('✅ Database connected successfully');
        return dataSource;
      },
    }),
    UserModule,
    AuthModule,
    DoctorModule,
    QueueModule,
    AppointmentModule,
  ],
})
export class AppModule {}
