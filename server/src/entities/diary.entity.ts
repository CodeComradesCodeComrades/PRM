import { Max, Min } from 'class-validator';
import { UserEntity } from 'src/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

export enum DiaryEncryption {
    NONE = 'none',
}

@Unique(['userId', 'date'])
@Entity('diary')
export class DiaryEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => UserEntity, {
        cascade: true,
    })
    user!: UserEntity;

    @Column()
    userId!: string;

    @Column({ type: 'date', default: () => 'CURRENT_DATE' })
    date: string;

    @Column()
    content!: string;

    @Column({ type: 'float', nullable: true })
    @Min(0.5)
    @Max(10)
    rating: number;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt!: Date;

    @Column({ type: 'varchar', default: DiaryEncryption.NONE })
    encryption: DiaryEncryption;
}
