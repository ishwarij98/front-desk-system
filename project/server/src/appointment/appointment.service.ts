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
    private queueService: QueueService, // Inject QueueService to auto‑enqueue
  ) {}

  /**
   * Create new appointment and enqueue patient
   */
  async create(data: Partial<Appointment>): Promise<Appointment> {
    const appointment = this.appointmentRepo.create(data);
    const saved = await this.appointmentRepo.save(appointment);

    // Automatically add patient to queue
    await this.queueService.addPatient({
      patientName: saved.patientName,
      reason: saved.notes || 'Appointment',
      doctorId: saved.doctorId,
      status: 'waiting',
    });

    return saved;
  }

  /**
   * Get all appointments, sorted by date/time
   */
  async findAll(): Promise<Appointment[]> {
    return this.appointmentRepo.find({
      order: { appointmentDateTime: 'ASC' },
    });
  }

  /**
   * Get appointments for a specific doctor
   */
  /**
 * Get appointments for a specific doctor
 */
async findByDoctor(doctorId: number): Promise<Appointment[]> {
  return this.appointmentRepo.find({
    where: { doctorId, status: 'booked' },  //  Only show booked ones
    order: { appointmentDateTime: 'ASC' },
  });
}


  /**
   * Get one appointment by ID (404 if not found)
   */
  async findOne(id: number): Promise<Appointment> {
    const appt = await this.appointmentRepo.findOne({ where: { id } });
    if (!appt) throw new NotFoundException('Appointment not found');
    return appt;
  }

  /**
   * Update appointment fields (reschedule, notes, etc.)
   */
  async update(id: number, updateData: Partial<Appointment>): Promise<Appointment> {
    const appt = await this.findOne(id);
    Object.assign(appt, updateData);
    return this.appointmentRepo.save(appt);
  }

  /**
   * Soft‑cancel appointment (mark status = 'cancelled')
   */
  async cancel(id: number): Promise<Appointment> {
    const appt = await this.findOne(id);
    appt.status = 'cancelled';
    return this.appointmentRepo.save(appt);
  }

  /**
   * Hard‑delete appointment (if you ever need it)
   */
  async remove(id: number): Promise<{ message: string }> {
    const appt = await this.findOne(id);
    await this.appointmentRepo.remove(appt);
    return { message: 'Appointment deleted successfully' };
  }

  
}
