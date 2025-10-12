import { table } from 'console';
import { pgTable, uuid, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { ta } from 'zod/locales';


export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text().notNull(),
    email: text().notNull().unique(),
})

export const courses = pgTable('courses', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text().notNull().unique(),
    description: text(),
})

export const enrollments = pgTable('enrollments', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid().notNull().references(() => users.id),
    courseId: uuid().notNull().references(() => courses.id),
    createdAt: timestamp({withTimezone: true}).notNull().defaultNow()
}, table => [
    uniqueIndex().on(table.userId, table.courseId)
]);