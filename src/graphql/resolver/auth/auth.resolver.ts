import { 
  Resolver, 
  Query, 
  Arg, 
  Mutation, 
  Args, 
  Ctx, 
  Authorized 
} from "type-graphql";
import { 
  RegisterInput, 
  ChangePasswordInput, 
  ResponseToken, 
  AuthSchema 
} from "../../schema";
import { getAuthToken } from "../../../lib/helpers/security";
import { getAuthController } from "../../../modules/authentication/auth.controller";
import { Context } from "../../../types/auth";


@Resolver()
export class AuthResolver {
  @Query(() => ResponseToken, { nullable: true })
  async SignInWithUsernameAndPassword(
    @Arg("username", () => String) username: string,
    @Arg("password", () => String) password: string
  ): Promise<ResponseToken> {
    const res = await getAuthController()
      .signinWithUsername(username, password);
    return res;
  }

  @Mutation(() => ResponseToken)
  async RegisterWithUsernameAndPassword(@Args(() => RegisterInput) {
    username,
    password
  }: RegisterInput): Promise<ResponseToken> {
    const res = getAuthController().
      registerWithUsername({ username, password });
    return res;
  }

  @Query(() => Boolean)
  async IsAuthenticated(@Ctx() { req }: Context): Promise<boolean> {
    const token = getAuthToken(req);
    if (!token) return false;
    try {
      const res = await getAuthController()
        .isAuthenticated(token);
      return res;
    }
    catch (err) {
      return false;
    }
  }

  @Authorized()
  @Query(() => AuthSchema)
  async CurrentUser(@Ctx() { req }: Context): Promise<AuthSchema> {
    return req.auth!;
  }

  @Authorized()
  @Mutation(() => Boolean)
  async ChangePassword(
    @Args(() => ChangePasswordInput) { newPassword, oldPassword }: ChangePasswordInput,
    @Ctx() { req }: Context
  ): Promise<boolean> {
    await getAuthController()
      .changePassword(req.auth!, oldPassword, newPassword)
    return true;
  }
}