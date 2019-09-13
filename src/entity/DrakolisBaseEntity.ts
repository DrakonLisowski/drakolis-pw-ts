import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class DrakolisBaseEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id: string;

  @Column({ nullable: false, default: true })
  public enabled: boolean;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

}
