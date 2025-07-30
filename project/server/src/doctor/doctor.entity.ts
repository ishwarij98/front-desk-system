import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Doctor table definition
@Entity()
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  specialization: string;

  @Column()
  gender: string;

  @Column()
  location: string;

  @Column()
  availability: string; // e.g., "Mon-Fri 9AM-5PM"
}
