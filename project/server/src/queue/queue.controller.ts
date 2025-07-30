import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { QueueService } from './queue.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('queue')
@UseGuards(JwtAuthGuard) //  All endpoints require JWT token
export class QueueController {
  constructor(private queueService: QueueService) {}

  // Add a patient to the queue
  @Post()
  async addPatient(@Body() body: any) {
    return this.queueService.addPatient(body);
  }

  // Get current queue
  @Get()
  async getQueue() {
    return this.queueService.getQueue();
  }

  //  Generic update for status, priority, etc.
  @Patch(':id')
  async updatePatient(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
  ) {
    return this.queueService.updatePatient(id, body);
  }

  // Remove a patient from the queue
  @Delete(':id')
  async removePatient(@Param('id', ParseIntPipe) id: number) {
    await this.queueService.removePatient(id);
    return { message: 'Patient removed from queue' };
  }
}
