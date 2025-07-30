import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './doctor.entity';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepo: Repository<Doctor>,
  ) {}

  // Create a doctor
  async create(doctorData: Partial<Doctor>): Promise<Doctor> {
    const doctor = this.doctorRepo.create(doctorData);
    return this.doctorRepo.save(doctor);
  }

  // List all doctors
  async findAll(): Promise<Doctor[]> {
    return this.doctorRepo.find();
  }

  // Find a doctor by ID
  async findOne(id: number): Promise<Doctor> {
    const doctor = await this.doctorRepo.findOne({ where: { id } });
    if (!doctor) throw new NotFoundException('Doctor not found');
    return doctor;
  }

  // Update a doctor
  async update(id: number, updateData: Partial<Doctor>): Promise<Doctor> {
    const doctor = await this.findOne(id);
    Object.assign(doctor, updateData);
    return this.doctorRepo.save(doctor);
  }

  // Delete a doctor
  async remove(id: number): Promise<void> {
    const doctor = await this.findOne(id);
    await this.doctorRepo.remove(doctor);
  }
}
