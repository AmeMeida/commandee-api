import { relations } from "drizzle-orm";
import {
  int,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  serial,
  varchar
} from "drizzle-orm/mysql-core";

export const commanda = mysqlTable("commanda", {
  id: serial("id").primaryKey(),
  costumer: varchar("costumer", { length: 255 }).notNull(),
  table: int("table"),
  restaurant: int("restaurant_id")
    .notNull()
    .references(() => restaurant.id)
});

export const commandaRelations = relations(commanda, ({ one, many }) => ({
  restaurant: one(restaurant, {
    fields: [commanda.id],
    references: [restaurant.id]
  }),
  orders: many(order)
}));

export const item = mysqlTable("item", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  price: int("price").notNull(),
  restaurant: int("restaurant_id")
    .notNull()
    .references(() => restaurant.id)
});

export const itemRelations = relations(item, ({ one, many }) => ({
  restaurant: one(restaurant, {
    fields: [item.id],
    references: [restaurant.id]
  }),
  orders: many(order)
}));

export const order = mysqlTable("order", {
  id: serial("id").primaryKey(),
  commanda: serial("commanda_id")
    .notNull()
    .references(() => commanda.id),
  item: serial("item_id")
    .notNull()
    .references(() => item.id),
  restaurant: varchar("restaurant_id", { length: 255 })
    .notNull()
    .references(() => restaurant.id),
  quantity: int("quantity").default(1),
  priority: mysqlEnum("priority", ["low", "medium", "high"]).default("low"),
  status: mysqlEnum("status", ["pending", "in_progress", "done"]).default(
    "pending"
  ),
  notes: varchar("notes", { length: 512 })
});

export const orderRelations = relations(order, ({ one }) => ({
  commanda: one(commanda, {
    fields: [order.commanda],
    references: [commanda.id]
  }),
  item: one(item, {
    fields: [order.item],
    references: [item.id]
  }),
  restaurant: one(restaurant, {
    fields: [order.restaurant],
    references: [restaurant.id]
  })
}));

export const restaurant = mysqlTable("restaurant", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  address: varchar("address", { length: 255 }).notNull()
});

export const restaurantRelations = relations(restaurant, ({ many }) => ({
  items: many(item),
  commandas: many(commanda),
  orders: many(order),
  owners: many(ownership),
  employees: many(employement)
}));

export const ownership = mysqlTable(
  "ownership",
  {
    owner: varchar("owner_id", { length: 255 })
      .notNull()
      .references(() => employee.id),
    restaurant: varchar("restaurant_id", { length: 255 })
      .notNull()
      .references(() => restaurant.id)
  },
  (t) => ({
    id: primaryKey(t.owner, t.restaurant)
  })
);

export const ownershipRelations = relations(ownership, ({ one }) => ({
  owner: one(employee, {
    fields: [ownership.owner],
    references: [employee.id]
  }),
  restaurant: one(restaurant, {
    fields: [ownership.restaurant],
    references: [restaurant.id]
  })
}));

export const employee = mysqlTable("employee", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull()
});

export const employeeRelations = relations(employee, ({ many }) => ({
  worksAt: many(employement),
  owns: many(ownership)
}));

export const employement = mysqlTable(
  "employement",
  {
    employee: varchar("employee_id", { length: 255 })
      .notNull()
      .references(() => employee.id),
    restaurant: varchar("restaurant_id", { length: 255 })
      .notNull()
      .references(() => restaurant.id)
  },
  (t) => ({ id: primaryKey(t.employee, t.restaurant) })
);

export const employementRelations = relations(employement, ({ one }) => ({
  employee: one(employee, {
    fields: [employement.employee],
    references: [employee.id]
  }),
  restaurant: one(restaurant, {
    fields: [employement.restaurant],
    references: [restaurant.id]
  })
}));
