import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

// The Queue table to manage patients waiting for consultation
@Entity()
export class Queue {
  @PrimaryGeneratedColumn()
  id: number;

  // Patient's name
  @Column()
  patientName: string;

  // Reason for visit or any notes
  @Column({ nullable: true })
  reason: string;

  // Status of patient in queue (default: waiting)
  @Column({ default: 'waiting' })
  status: string; // waiting | in_consultation | completed

  @Column({ default: 'Normal' })
  priority: string;


  // Doctor ID (optional: you can relate it later to Doctor entity)
  @Column({ nullable: true })
  doctorId: number;

  // Timestamp when the patient was added
  @CreateDateColumn()
  createdAt: Date;
}
