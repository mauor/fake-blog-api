import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'User'})
export class User {

    @PrimaryGeneratedColumn('uuid')
    user_id: string;

    @Column('varchar', { unique: true, length: 255, nullable: false })
    email: string;

    @Column('varchar', { length: 255, nullable: false })
    password: string;

    @CreateDateColumn()
    createDate: Date;
}
