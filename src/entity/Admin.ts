import { Entity, Column } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity()
export class Admin extends BaseEntity {

  @Column()
  public email: string;

  @Column()
  public passwordHash: string;

}
