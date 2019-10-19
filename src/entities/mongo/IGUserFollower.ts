import { Entity, Column } from 'typeorm';
import { MongoBaseEntity } from './MongoBaseEntity';

@Entity()
export default class IGUserFollower extends MongoBaseEntity {
  @Column()
  public owner: number;

  @Column()
  public pk: number;

  @Column()
  public username: string;

  @Column()
  public fullName: string;

  @Column()
  public isPrivate: boolean;

  @Column()
  public profilePicUrl: string;

  @Column()
  public profilePicId: string;

  @Column()
  public isVerified: boolean;

  @Column()
  public hasAnonymousProfilePicture: boolean;

  @Column()
  public latestReelMedia: string;
}
