import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

export enum CloudInstanceMessageTypes {
    connect = 'connect',
    clientConnected = 'clientConnected',
    clientDisconnected = 'clientDisconnected',
    pong = 'pong',
}

export interface ICloudInstanceMessage {
    type: CloudInstanceMessageTypes;
}

export enum CloudInstanceStatus {
    Waiting,
    Working
}

@Entity({ name: `cloud_instance_table_${process.env.NODE_ENV}` })
export class CloudInstanceEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('varchar', { unique: true, length: 355 })
    ip!: string;

    @Column('varchar', { length: 355 })
    domain!: string;

    @Column('varchar', { length: 355 })
    port!: string;

    @Column('varchar', { length: 355 })
    type!: string;

    @Column({ type: 'enum', enum: CloudInstanceStatus, default: CloudInstanceStatus.Waiting })
    status!: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    @VersionColumn()
    version!: number;
}
