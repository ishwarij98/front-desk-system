import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Queue } from './queue.entity';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Queue])], // Register Queue entity with TypeORM
  controllers: [QueueController],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
