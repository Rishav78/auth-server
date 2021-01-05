import { Resolver, Query, Arg, Mutation, Args, Ctx, Authorized } from "type-graphql";

// modules
import { Context } from "../../../types/auth";

import * as controllers from "../../../controllers";

// @types
import { RegisterInput, ChangePasswordInput, ResponseToken } from "../../schema";
import { getAuthToken } from "../../../lib/helpers/security";

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

  @Mutation(() => ResponseToken)
  async RegisterWithUsernameAndPassword(@Args(() => RegisterInput) {
    username,
    password
  }: RegisterInput): Promise<ResponseToken> {
    const res = controllers.auth.RegisterWithUsernameAndPassword({username, password});
    return res;
  }

  @Query(() => Boolean)
  async IsAuthenticated(@Ctx() {req}: Context): Promise<boolean> {
    const token = getAuthToken(req);
    if(!token) return false;
    const res = controllers.auth.isAuthenticated(token);
    return res;
  }

  @Authorized()
  @Mutation(() => Boolean)
  async ChangePassword(
    @Args(() => ChangePasswordInput) {newPassword, oldPassword}: ChangePasswordInput,
    @Ctx() {req} : Context
  ): Promise<boolean> {
    await controllers.auth.changePassword(req.auth!, oldPassword, newPassword)
    return true;
  }
}