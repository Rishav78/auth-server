import {AuthResolver} from "./auth/auth.resolver";

const rootResolver: any = [
  AuthResolver,
];

export default rootResolver;