import { Resolver, Query, Arg, Mutation, Args, Ctx, Authorized } from "type-graphql";

// modules
import { Context } from "../../../types/auth";

import * as controllers from "../../../controllers";

// @types
// import { RegisterInput, ResponseToken, ChangePasswordInput } from "../../schema";
import { Auth, ResponseToken } from "../../schema";

@Resolver()
export class AuthResolver {
  @Query(() => ResponseToken, { nullable: true })
  async SignInWithUsernameAndPassword(
    @Arg("username", () => String) username: string,
    @Arg("password", () => String) password: string
  ): Promise<ResponseToken> {
    const res = controllers.auth.SignInWithUsernameAndPassword(username, password);
    return res;
  }

//   @Mutation(() => ResponseToken)
//   async RegisterWithUsernameAndPassword(@Args() {
//     username,
//     firstname,
//     middlename,
//     lastname,
//     password,
//     country,
//     dob
//   }: RegisterInput): Promise<ResponseToken> {
//     const res = controllers.auth.RegisterWithUsernameAndPassword({
//       username, 
//       password, 
//       firstname, 
//       middlename, 
//       lastname, 
//       dob, 
//       country
//     });
//     return res;
//   }

//   @Authorized()
//   @Mutation(() => Boolean)
//   async ChangePassword(
//     @Args() {newPassword, oldPassword}: ChangePasswordInput,
//     @Ctx() {req} : Context
//   ): Promise<boolean> {
//     await controllers.auth.changePassword(req.auth!, oldPassword, newPassword)
//     return true;
//   }
}