import { 
  ObjectType, 
  Field, 
  InputType, 
  ArgsType 
} from "type-graphql";

@ObjectType()
export class ResponseToken {
  @Field(() => String) 
  token: string;

  @Field(() => String) 
  timestamp: string;
};

@InputType()
export class SigninInputs {
  @Field(() => String) 
  username: string;

  @Field(() => String) 
  password: string;
};

@ArgsType()
export class RegisterInput {
  @Field(() => String) 
  username: string;

  @Field(() => String) 
  password: string;

  @Field(() => String) 
  firstname: string;

  @Field(() => String, {nullable: true}) 
  middlename: string;

  @Field(() => String) 
  lastname: string;

  @Field(() => String) 
  dob: string;

  @Field(() => String) 
  country: string;
};

@ArgsType()
export class ChangePasswordInput {
  @Field(() => String, {nullable: false})
  oldPassword: string;

  @Field(() => String, {nullable: false})
  newPassword: string;
}