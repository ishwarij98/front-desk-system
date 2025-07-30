import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('doctors')
@UseGuards(JwtAuthGuard) // ✅ All routes in this controller require authentication
export class DoctorController {
  constructor(private doctorService: DoctorService) {}

  // Add a doctor
  @Post()
async create(@Body() body: any) {
  console.log('Request body:', body); // 👈 Debug log
  if (!body.name || !body.specialization) {
    throw new BadRequestException('Name and specialization are required');
  }
  return this.doctorService.create(body);
}


  // List all doctors
  @Get()
  async findAll() {
    return this.doctorService.findAll();
  }

  // Update a doctor
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
  ) {
    return this.doctorService.update(id, body);
  }

  // Delete a doctor
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.doctorService.remove(id);
    return { message: 'Doctor deleted successfully' };
  }
}
