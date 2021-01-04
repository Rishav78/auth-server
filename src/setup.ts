import "reflect-metadata";
import express from "express";

const port = process.env.PORT || 4000;

export const init = async () => {
  const app = express();
   
  app.get("/", (req, res, next) => {
    return res.status(200).send("Hello World!");
  });

  app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}`);
    //console.log(`Access graphql API at http://localhost:${port}/graphql`);
  }) 
}
