import { pgTable, serial, integer, text, real, boolean, timestamp, date, doublePrecision, uuid } from 'drizzle-orm/pg-core';
// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  phone: text('phone').notNull().unique(),
  name: text('name').notNull(),
  gender: text('gender'),
  age: integer('age'),
  occupation: text('occupation'),
  profilePhoto: text('profile_photo'),
  createdAt: timestamp('created_at', { withTimezone: false }).notNull(),
});

// Properties table
export const properties = pgTable('properties', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  address: text('address').notNull(),
  city: text('city').notNull(),
  locality: text('locality').notNull(),
  latitude: doublePrecision('latitude'),
  longitude: doublePrecision('longitude'),
  genderType: text('gender_type').notNull(),
  thumbnailImage: text('thumbnail_image'),
  images: text('images'),
  startingPrice: integer('starting_price').notNull(),
  amenities: text('amenities'),
  virtualTourUrl: text('virtual_tour_url'),
  cancellationPolicy: text('cancellation_policy'),
  refundPolicy: text('refund_policy'),
  managerPhone: text('manager_phone'),
  managerName: text('manager_name'),
  rating: real('rating').default(0),
  totalReviews: integer('total_reviews').default(0),
  isAvailable: boolean('is_available').default(true),
  createdAt: timestamp('created_at', { withTimezone: false }).notNull(),
});

// Room Types table
export const roomTypes = pgTable('room_types', {
  id: serial('id').primaryKey(),
  propertyId: integer('property_id').references(() => properties.id).notNull(),
  type: text('type').notNull(),
  pricePerMonth: integer('price_per_month').notNull(),
  availableRooms: integer('available_rooms').notNull(),
  totalRooms: integer('total_rooms').notNull(),
  createdAt: timestamp('created_at', { withTimezone: false }).notNull(),
});

// Bookings table
export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  propertyId: integer('property_id').references(() => properties.id).notNull(),
  roomTypeId: integer('room_type_id').references(() => roomTypes.id).notNull(),
  moveInDate: date('move_in_date').notNull(),
  durationMonths: integer('duration_months').notNull(),
  totalAmount: integer('total_amount').notNull(),
  bookingAmountPaid: integer('booking_amount_paid').notNull(),
  status: text('status').notNull(),
  paymentStatus: text('payment_status').notNull(),
  nextRentDueDate: date('next_rent_due_date'),
  bookingConfirmationUrl: text('booking_confirmation_url'),
  cancellationDate: date('cancellation_date'),
  refundStatus: text('refund_status'),
  refundAmount: integer('refund_amount'),
  createdAt: timestamp('created_at', { withTimezone: false }).notNull(),
});

// Favorites table
export const favorites = pgTable('favorites', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  propertyId: integer('property_id').references(() => properties.id).notNull(),
  createdAt: timestamp('created_at', { withTimezone: false }).notNull(),
});

// Help Support Requests table
export const helpSupportRequests = pgTable('help_support_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: integer('user_id').references(() => users.id),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Payments table
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  bookingId: integer('booking_id').references(() => bookings.id).notNull(),
  amount: integer('amount').notNull(),
  paymentType: text('payment_type').notNull(),
  paymentMethod: text('payment_method'),
  transactionId: text('transaction_id'),
  status: text('status').notNull(),
  invoiceUrl: text('invoice_url'),
  createdAt: timestamp('created_at', { withTimezone: false }).notNull(),
});

// Wallet table
export const wallet = pgTable('wallet', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull().unique(),
  balance: integer('balance').default(0),
  updatedAt: timestamp('updated_at', { withTimezone: false }).notNull(),
});

// Maintenance Requests table
export const maintenanceRequests = pgTable('maintenance_requests', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  bookingId: integer('booking_id').references(() => bookings.id).notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  status: text('status').notNull(),
  createdAt: timestamp('created_at', { withTimezone: false }).notNull(),
  resolvedAt: timestamp('resolved_at', { withTimezone: false }),
});

// Reviews table
export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  propertyId: integer('property_id').references(() => properties.id).notNull(),
  bookingId: integer('booking_id').references(() => bookings.id).notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: false }).notNull(),
});

// Feedback table
export const feedback = pgTable('feedback', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  name: text('name').notNull(),
  email: text('email').notNull(),
  message: text('message').notNull(),
  rating: integer('rating').notNull(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow(),
});

// Property Visits table
export const propertyVisits = pgTable('property_visits', {
  id: serial('id').primaryKey(),
  propertyId: integer('property_id').references(() => properties.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  date: date('date').notNull(),
  timeSlot: text('time_slot').notNull(),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow(),
});