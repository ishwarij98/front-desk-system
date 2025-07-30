// src/appointments/appointment.controller.ts

import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('appointments')
@UseGuards(JwtAuthGuard) // Protect all endpoints with JWT
export class AppointmentController {
  constructor(private appointmentService: AppointmentService) {}

  /**
   * 1️⃣ Book a new appointment
   * POST /appointments
   * Body: { patientName, doctorId, appointmentDateTime, notes? }
   */
  @Post()
  async create(@Body() body: any) {
    return this.appointmentService.create(body);
  }

  /**
   * 2️⃣ Get all appointments, optionally filtered by doctor
   * GET /appointments?doctorId=2
   */
  @Get()
  async findAll(
    @Query('doctorId') doctorId?: string,
  ) {
    if (doctorId) {
      return this.appointmentService.findByDoctor(+doctorId);
    }
    return this.appointmentService.findAll();
  }

  /**
   * 3️⃣ Get a single appointment
   * GET /appointments/:id
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentService.findOne(id);
  }

  /**
   * 4️⃣ Update an appointment (reschedule, notes, status)
   * PATCH /appointments/:id
   * Body: { appointmentDateTime?, notes?, status? }
   */
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
  ) {
    return this.appointmentService.update(id, body);
  }

  /**
   * 5️⃣ Cancel (soft-delete) an appointment
   * PATCH /appointments/:id/cancel
   */
  @Patch(':id/cancel')
  async cancel(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentService.cancel(id);
  }
}
