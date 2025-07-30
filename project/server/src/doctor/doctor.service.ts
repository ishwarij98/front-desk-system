import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './doctor.entity';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor) private doctorRepo: Repository<Doctor>,
  ) {}

  async findAll() {
    return this.doctorRepo.find();
  }

  async findOne(id: number) {
    const doctor = await this.doctorRepo.findOne({ where: { id } });
    if (!doctor) throw new NotFoundException('Doctor not found');
    return doctor;
  }

  async create(data: Partial<Doctor>) {
    const doctor = this.doctorRepo.create(data);
    return this.doctorRepo.save(doctor);
  }

  async update(id: number, data: Partial<Doctor>) {
    const doctor = await this.findOne(id);
    Object.assign(doctor, data);
    return this.doctorRepo.save(doctor);
  }

  async remove(id: number) {
    const doctor = await this.findOne(id);
    return this.doctorRepo.remove(doctor);
  }
}
