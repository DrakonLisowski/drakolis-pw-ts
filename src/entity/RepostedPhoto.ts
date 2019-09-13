import { Entity, Column } from 'typeorm';
import { DrakolisBaseEntity } from './DrakolisBaseEntity';

@Entity()
export class RepostedPhoto extends DrakolisBaseEntity {

  @Column()
  public fileId: string;

  @Column()
  public likes: number;

}
