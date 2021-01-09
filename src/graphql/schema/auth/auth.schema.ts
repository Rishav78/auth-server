import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Auth {
  @Field(() => String)
  uid: string;

  @Field(() => String)
  username: string;

  @Field(() => String, {nullable: true})
  password?: string;

  @Field(() => Boolean)
  isDeleted: boolean;

  @Field(() => Boolean, { defaultValue: true })
  active: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}