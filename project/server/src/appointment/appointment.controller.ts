import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('appointments')
@UseGuards(JwtAuthGuard) // ✅ Protect all routes
export class AppointmentController {
  constructor(private appointmentService: AppointmentService) {}

  // Book a new appointment
  @Post()
  async create(@Body() body: any) {
    return this.appointmentService.create(body);
  }

  // Get all appointments
  @Get()
  async findAll() {
    return this.appointmentService.findAll();
  }

  // Update appointment (reschedule, notes, etc.)
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.appointmentService.update(id, body);
  }

  // Cancel appointment
  @Patch(':id/cancel')
  async cancel(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentService.cancel(id);
  }
}
