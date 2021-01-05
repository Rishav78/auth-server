import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("auth", table => {

    table.uuid("uid")
      .unique()
      .notNullable()
      .primary()
      .defaultTo(knex.raw("uuid_generate_v4()"));

    table.text("username")
      .unique()
      .index()
      .notNullable();

    table.text("password")
      .notNullable();

    table.boolean("is_active")
      .notNullable()
      .defaultTo(true);

    table.boolean("is_deleted")
      .notNullable()
      .defaultTo(false);

    table.timestamps(true, true);
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("auth");
}

