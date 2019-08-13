import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Customers {

  @PrimaryGeneratedColumn()
  public id: string;

  @Column()
  public name: string;

  @Column()
  public passkey: string;
}
