import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("token_secret", table => {
    table.uuid("id")
      .unique()
      .notNullable()
      .primary()
      .index()
      .defaultTo(knex.raw("uuid_generate_v4()"));

    table.uuid("auth_id")
      .notNullable()
      .index()
      .references("uid")
      .inTable("auth");

    table.boolean("is_deleted")
      .notNullable()
      .defaultTo(false);

    table.text("auth_token_secret")
      .notNullable()
      .unique();

    table.text("refresh_token_secret")
      .notNullable()
      .unique();

    table.date("created_at")
      .notNullable()
      .defaultTo(knex.fn.now());

    table.date("updated_at")
      .notNullable()
      .defaultTo(knex.fn.now());
  })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("token_secret");
}

