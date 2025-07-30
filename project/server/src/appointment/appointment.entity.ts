import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  patientName: string; // Name of patient

  @Column()
  doctorId: number; // Which doctor is assigned

  @Column()
  appointmentDateTime: string; // e.g. "2025-08-01 10:00"

  @Column({ default: 'booked' })
  status: string; // booked | completed | cancelled

  @Column({ nullable: true })
  notes?: string; // Optional notes for appointment

  @CreateDateColumn()
  createdAt: Date; // Auto-generated when inserted
}
