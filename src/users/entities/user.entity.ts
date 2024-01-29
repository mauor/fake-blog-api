import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'User'})
export class User {

    @ApiProperty({
        example: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8',
        description: 'Unique identifier assigned to each user within a system. This serves as a distinctive reference to distinguish one user from another.',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    user_id: string;

    @ApiProperty({
        example: 'example@example.com',
        description: 'Users unique email address, used for account access.',
        uniqueItems: true
    })
    @Column('varchar', { unique: true, length: 255, nullable: false })
    email: string;

    @ApiProperty({
        example: 'Ix58-3Bj',
        description: 'Confidential alphanumeric code chosen by the user during registration, serving as a security measure to authenticate and protect access to the account.',
    })
    @Column('varchar', { length: 72, nullable: false, select: true })
    password: string;

    @ApiProperty({
        example: 'John',
        description: 'The given or first name of the user.',
    })
    @Column('varchar', { length: 255, nullable: false })
    first_name: string;

    @ApiProperty({
        example: 'Doe',
        description: 'The surname or family name of the user.',
    })
    @Column('varchar', { length: 255, nullable: false })
    last_name: string;

    @ApiProperty({
        example: 'M',
        description: 'Denotes the gender identity of the user, specifying whether they identify as male, female or another.',
    })
    @Column('char', { length: 1, nullable: true })
    gender: string;

    @ApiProperty({
        example: '2024-01-01 01:00:00.000000',
        description: 'Timestamp indicating the date and time when the user account was created or registered within the system.',
    })
    @CreateDateColumn()
    create_date: Date;

    @ApiProperty({
        example: '2024-01-01 01:00:00.000000',
        description: 'Timestamp indicating the date and time when the user account was deleted or marked for deletion within the system.',
    })
    @DeleteDateColumn()
    delete_date?: Date;
}
