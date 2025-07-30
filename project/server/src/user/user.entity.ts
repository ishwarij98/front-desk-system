import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// 👇 Define user roles (admin, staff, doctor)
export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
  DOCTOR = 'doctor',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  // 👇 New column to store user role (default: staff)
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STAFF, // default if not specified
  })
  role: UserRole;
}
