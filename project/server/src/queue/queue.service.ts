import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Queue } from './queue.entity';

@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(Queue)
    private queueRepo: Repository<Queue>,
  ) {}

  // Add a patient to the queue
  async addPatient(data: Partial<Queue>): Promise<Queue> {
    console.log('New patient data:', data);
    const patient = this.queueRepo.create(data);
    return this.queueRepo.save(patient);
  }

  // ✅ Always return Urgent first, then Normal, then by createdAt
  async getQueue(): Promise<Queue[]> {
    return this.queueRepo
      .createQueryBuilder('queue')
      .orderBy(
        `CASE WHEN queue.priority = 'Urgent' THEN 1 ELSE 2 END`, // Urgent first
      )
      .addOrderBy('queue.createdAt', 'ASC') // within priority, oldest first
      .getMany();
  }

  // Update patient (status/priority)
  async updatePatient(id: number, updateData: Partial<Queue>): Promise<Queue> {
    const patient = await this.queueRepo.findOne({ where: { id } });
    if (!patient) throw new NotFoundException('Patient not found');

    Object.assign(patient, updateData);
    return this.queueRepo.save(patient);
  }

  // Remove a patient from the queue
  async removePatient(id: number): Promise<void> {
    const patient = await this.queueRepo.findOne({ where: { id } });
    if (!patient) throw new NotFoundException('Patient not found');
    await this.queueRepo.remove(patient);
  }
}
