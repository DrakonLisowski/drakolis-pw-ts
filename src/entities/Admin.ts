import { Entity, Column } from 'typeorm';
import { DrakolisBaseEntity } from './DrakolisBaseEntity';

@Entity()
export class Admin extends DrakolisBaseEntity {

  @Column()
  public email: string;

  @Column()
  public passwordHash: string;

}
