import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column()
  username: string = '';

  @Column()
  avatar: string = '';

  @Column()
  phone: string = '';

  @Column()
  password: string = '';

  @Column()
  openId: string = '';
}
