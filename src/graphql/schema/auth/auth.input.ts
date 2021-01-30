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
  refreshToken: string;

  @Field(() => String) 
  timestamp: string;

  constructor(token: string, refreshToken: string) {
    this.token = token;
    this.refreshToken = refreshToken;
    this.timestamp = new Date().getTime().toString(); // graphql does not support int greater then 32 bit
  }
};

@InputType()
export class SigninInputs {
  @Field(() => String) 
  username!: string;

  @Field(() => String) 
  password!: string;
};

@ArgsType()
export class RegisterInput {
  @Field(() => String) 
  username!: string;

  @Field(() => String) 
  password!: string;
};

@ArgsType()
export class ChangePasswordInput {
  @Field(() => String, {nullable: false})
  oldPassword!: string;

  @Field(() => String, {nullable: false})
  newPassword!: string;
}