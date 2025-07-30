import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { QueueService } from '../queue/queue.service';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
    private queueService: QueueService, // ✅ inject QueueService to add patient automatically
  ) {}

  /**
   * Create new appointment and add patient to Queue
   */
  async create(data: Partial<Appointment>): Promise<Appointment> {
    // 1️⃣ Create and save appointment
    const appointment = this.appointmentRepo.create(data);
    const savedAppointment = await this.appointmentRepo.save(appointment);

    // 2️⃣ Add to queue automatically
    await this.queueService.addPatient({
      patientName: savedAppointment.patientName,
      reason: savedAppointment.notes || 'Appointment',
      doctorId: savedAppointment.doctorId,
      status: 'waiting', // Default when booked
    });

    return savedAppointment;
  }

  /**
   * List all appointments sorted by date/time
   */
  async findAll(): Promise<Appointment[]> {
    return this.appointmentRepo.find({
      order: { appointmentDateTime: 'ASC' },
    });
  }

  /**
   * Find one appointment by id
   */
  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.appointmentRepo.findOne({ where: { id } });
    if (!appointment) throw new NotFoundException('Appointment not found');
    return appointment;
  }

  /**
   * Update appointment details (reschedule, doctor change, notes, etc.)
   */
  async update(id: number, updateData: Partial<Appointment>): Promise<Appointment> {
    const appointment = await this.findOne(id);
    Object.assign(appointment, updateData);
    return this.appointmentRepo.save(appointment);
  }

  /**
   * Cancel appointment (set status = 'cancelled')
   */
  async cancel(id: number): Promise<Appointment> {
    const appointment = await this.findOne(id);
    appointment.status = 'cancelled';
    return this.appointmentRepo.save(appointment);
  }
}
