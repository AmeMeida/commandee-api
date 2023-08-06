import { relations, sql } from "drizzle-orm";
import {
  index,
  int,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  varchar
} from "drizzle-orm/mysql-core";

export const commandaTable = mysqlTable(
  "commanda",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`(UUID())`),
    costumer: varchar("costumer", { length: 255 }).notNull(),
    table: int("table"),
    restaurant: varchar("restaurant_id", { length: 36 })
      .notNull()
      .references(() => restaurantTable.id),
    publicId: varchar("public_id", { length: 16 }).notNull().unique()
  },
  (t) => ({
    restaurantIdx: index("commanda_restaurant_idx").on(t.restaurant)
  })
);

export const commandaRelations = relations(commandaTable, ({ one, many }) => ({
  restaurant: one(restaurantTable, {
    fields: [commandaTable.restaurant],
    references: [restaurantTable.id]
  }),
  orders: many(order)
}));

export const itemTable = mysqlTable(
  "item",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`(UUID())`),
    name: varchar("name", { length: 255 }).notNull(),
    price: int("price").notNull(),
    restaurant: varchar("restaurant_id", { length: 36 })
      .notNull()
      .references(() => restaurantTable.id),
    publicId: varchar("public_id", { length: 16 }).notNull().unique()
  },
  (t) => ({
    restaurantIdx: index("item_restaurant_idx").on(t.restaurant),
    nameIdx: index("item_name_idx").on(t.name)
  })
);

export const itemRelations = relations(itemTable, ({ one, many }) => ({
  restaurant: one(restaurantTable, {
    fields: [itemTable.restaurant],
    references: [restaurantTable.id]
  }),
  orders: many(order)
}));

export const order = mysqlTable(
  "order",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`(UUID())`),
    publicId: varchar("public_id", { length: 16 }).notNull().unique(),
    commanda: varchar("commanda_id", { length: 36 })
      .notNull()
      .references(() => commandaTable.id),
    item: varchar("item_id", { length: 36 })
      .notNull()
      .references(() => itemTable.id),
    restaurant: varchar("restaurant_id", { length: 36 })
      .notNull()
      .references(() => restaurantTable.id),
    quantity: int("quantity").default(1),
    priority: mysqlEnum("priority", ["low", "medium", "high"]).default("low"),
    status: mysqlEnum("status", ["pending", "in_progress", "done"]).default(
      "pending"
    ),
    notes: varchar("notes", { length: 512 })
  },
  (t) => ({
    commandaIdx: index("order_commanda_idx").on(t.commanda),
    itemIdx: index("order_item_idx").on(t.item),
    restaurantIdx: index("order_restaurant_idx").on(t.restaurant)
  })
);

export const orderRelations = relations(order, ({ one }) => ({
  commanda: one(commandaTable, {
    fields: [order.commanda],
    references: [commandaTable.id]
  }),
  item: one(itemTable, {
    fields: [order.item],
    references: [itemTable.id]
  }),
  restaurant: one(restaurantTable, {
    fields: [order.restaurant],
    references: [restaurantTable.id]
  })
}));

export const restaurantTable = mysqlTable("restaurant", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .default(sql`(UUID())`),
  publicId: varchar("public_id", { length: 16 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  address: varchar("address", { length: 255 }).notNull()
});

export const restaurantRelations = relations(restaurantTable, ({ many }) => ({
  items: many(itemTable),
  commandas: many(commandaTable),
  orders: many(order),
  owners: many(ownershipTable),
  employees: many(employementTable)
}));

export const ownershipTable = mysqlTable(
  "ownership",
  {
    owner: varchar("owner_id", { length: 36 })
      .notNull()
      .references(() => employeeTable.id),
    restaurant: varchar("restaurant_id", { length: 36 })
      .notNull()
      .references(() => restaurantTable.id)
  },
  (t) => ({
    id: primaryKey(t.owner, t.restaurant)
  })
);

export const ownershipRelations = relations(ownershipTable, ({ one }) => ({
  owner: one(employeeTable, {
    fields: [ownershipTable.owner],
    references: [employeeTable.id]
  }),
  restaurant: one(restaurantTable, {
    fields: [ownershipTable.restaurant],
    references: [restaurantTable.id]
  })
}));

export const employeeTable = mysqlTable("employee", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .default(sql`(UUID())`),
  publicId: varchar("public_id", { length: 16 }).notNull().unique(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull()
});

export const employeeRelations = relations(employeeTable, ({ many }) => ({
  worksAt: many(employementTable),
  owns: many(ownershipTable)
}));

export const employementTable = mysqlTable(
  "employement",
  {
    employee: varchar("employee_id", { length: 36 })
      .notNull()
      .references(() => employeeTable.id),
    restaurant: varchar("restaurant_id", { length: 36 })
      .notNull()
      .references(() => restaurantTable.id)
  },
  (t) => ({ id: primaryKey(t.employee, t.restaurant) })
);

export const employementRelations = relations(employementTable, ({ one }) => ({
  employee: one(employeeTable, {
    fields: [employementTable.employee],
    references: [employeeTable.id]
  }),
  restaurant: one(restaurantTable, {
    fields: [employementTable.restaurant],
    references: [restaurantTable.id]
  })
}));
