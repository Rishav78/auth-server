import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class AuthSchema {
  @Field(() => String, {nullable: false})
  uid!: string;

  @Field(() => String, {nullable: false})
  username!: string;

  @Field(() => String, {nullable: true})
  password?: string;

  @Field(() => Boolean, {nullable: false})
  isDeleted!: boolean;

  @Field(() => Boolean, {nullable: false})
  active!: boolean;

  @Field(() => Date, {nullable: false})
  createdAt!: Date;

  @Field(() => Date, {nullable: false})
  updatedAt!: Date;

  public setUid = (uid: string) => {
    this.uid = uid;
    return this;
  }

  public setUsername = (username: string) => {
    this.username = username;
    return this;
  }

  public setPassword = (password?: string) => {
    this.password = password;
    return this;
  }

  public setIsDeleted = (isDeleted: boolean) => {
    this.isDeleted = isDeleted;
    return this;
  }

  public setActive = (active: boolean) => {
    this.active = active;
    return this;
  }

  public setTimestamp = (createdAt: Date, updatedAt: Date) => {
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    return this;
  }
}