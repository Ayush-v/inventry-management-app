import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from "uuid";

export const usersTable = sqliteTable("users_table", {
  id: text()
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  name: text().notNull(),
});
