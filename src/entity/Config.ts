import {
  Entity,
  Column,
} from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity()
export class Config extends BaseEntity {

  @Column({ unique: true })
  public key: string;

  @Column({ nullable: true, default: null })
  public string: string;

  @Column({ nullable: true, default: null })
  public boolean: boolean;

  @Column({ type: 'bigint', nullable: true, default: null })
  public integer: number;

  @Column({ type: 'double precision', nullable: true, default: null })
  public float: number;

  @Column({ nullable: true, default: null })
  public datetime: Date;

  @Column({ nullable: false, default: false })
  public private: boolean;

}
