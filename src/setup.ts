import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";

import RootResolver from "./graphql/resolver";

import { customAuthChecker, defaultAuthCheck } from "./lib/middlewares/auth";
import { error404 } from "./lib/middlewares/errorHandler";

import router from "./routes";

import {logger} from "./core";

const port = process.env.PORT || 4000;

export const init = async () => {
  const app = express();

  logger.info("Connecting to database...");
  import("./db/db");
  logger.info("Connection established");

  logger.info("Initilizing Middlewares...");
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
  app.use(defaultAuthCheck());

  logger.info("Initilizing Apollo Server...");
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

  logger.info("Initilizing Routes...");
  app.use(router);

  /**
   * wrong route handler
   */
  app.use(error404());

  app.listen(port, () => {
    logger.info(`🚀 Server ready at http://localhost:${port}`);
    logger.info(`Access graphql API at http://localhost:${port}/graphql`);
  }) 
}
