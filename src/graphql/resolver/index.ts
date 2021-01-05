import {AuthResolver} from "./auth/auth.resolver";

const rootResolver: readonly [Function, ...Function[]] | [Function, ...Function[]] | readonly [string, ...string[]] | [string, ...string[]] = [
  AuthResolver,
];

export default rootResolver;