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
}