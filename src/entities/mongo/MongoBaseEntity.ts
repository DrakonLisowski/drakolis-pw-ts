import { BaseEntity, ObjectIdColumn, ObjectID } from 'typeorm';

export abstract class MongoBaseEntity extends BaseEntity {
  @ObjectIdColumn()
  public id: ObjectID;
}
