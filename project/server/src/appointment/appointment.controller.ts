// src/appointments/appointment.controller.ts

import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,          // 👈 import Delete
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('/api/appointments')
@UseGuards(JwtAuthGuard) // Protect all endpoints with JWT
export class AppointmentController {
  constructor(private appointmentService: AppointmentService) {}

  /** 1️⃣ Book a new appointment */
  @Post()
  async create(@Body() body: any) {
    return this.appointmentService.create(body);
  }

  /** 2️⃣ Get all appointments */
  @Get()
  async findAll(@Query('doctorId') doctorId?: string) {
    if (doctorId) {
      return this.appointmentService.findByDoctor(+doctorId);
    }
    return this.appointmentService.findAll();
  }

  /** 3️⃣ Get a single appointment */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentService.findOne(id);
  }

  /** 4️⃣ Update an appointment */
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.appointmentService.update(id, body);
  }

  /** 5️⃣ Cancel (soft-delete) an appointment */
  @Patch(':id/cancel')
  async cancel(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentService.cancel(id);
  }

  /** 6️⃣ Hard delete (remove completely from DB) */
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentService.remove(id);
  }
}
