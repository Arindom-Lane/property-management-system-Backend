import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AdminEntity } from './admin.entity';

@Entity('announcements')
export class AnnouncementEntity  {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ type: 'text' })
    body: string;

    @ManyToOne(() => AdminEntity)
    @JoinColumn({ name: 'created_by_id' })
    created_by: AdminEntity;

    @CreateDateColumn()
    created_at: Date;
}
