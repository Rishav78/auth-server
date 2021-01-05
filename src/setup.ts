import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";

import RootResolver from "./graphql/resolver";

import { customAuthChecker } from "./middlewares/auth";

import router from "./routes/auth.routes";


const port = process.env.PORT || 4000;

export const init = async () => {
  const app = express();

  import("./db/db");

  app.use(router);

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: RootResolver,
      validate: false,
      authChecker: customAuthChecker,
    }),
    debug: true,
    context: ({ req, res }) => ({ req, res }),
  });

  apolloServer.applyMiddleware({ app, cors: true });

  app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}`);
    console.log(`Access graphql API at http://localhost:${port}/graphql`);
  }) 
}
