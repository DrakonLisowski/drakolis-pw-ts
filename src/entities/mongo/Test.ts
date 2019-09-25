import { Entity, Column } from 'typeorm';
import { MongoBaseEntity } from './MongoBaseEntity';

@Entity()
class Test extends MongoBaseEntity {
  @Column()
  public hui: string;

}

export { Test };
