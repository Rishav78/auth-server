import * as Knex from "knex";
import bcrypt from "bcrypt";

import config from "../../core/config";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("auth").del();

    // Inserts seed entries
    await knex("auth").insert([
        {
            uid: "084cb2b0-bcad-4932-9d71-48fb6e03ea27",
            username: "admin",
            password: await bcrypt.hash("admin", await bcrypt.genSalt(config.saltRound))
        }
    ]);
};
