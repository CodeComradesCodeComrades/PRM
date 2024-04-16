import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ default: '' })
    name!: string;

    @Column({ unique: true })
    email!: string;

    @Column({ default: '', select: false })
    password!: string;
}
