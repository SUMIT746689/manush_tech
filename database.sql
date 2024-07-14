CREATE TABLE "public"."foodCategories" ( 
  "id" SERIAL,
  "name" VARCHAR(255) NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  CONSTRAINT "foodCategories_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "public"."foodItems" ( 
  "id" SERIAL,
  "name" VARCHAR(255) NOT NULL,
  "foodCategoryId" INTEGER NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  CONSTRAINT "foodItems_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "foodItems_name_key2" UNIQUE ("name"),
  CONSTRAINT "foodItems_name_key1" UNIQUE ("name"),
  CONSTRAINT "foodItems_name_key" UNIQUE ("name")
);
CREATE TABLE "public"."mealFoodItems" ( 
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "foodItemId" INTEGER NOT NULL,
  "mealId" INTEGER NOT NULL,
  CONSTRAINT "mealFoodItems_pkey" PRIMARY KEY ("foodItemId", "mealId")
);
CREATE TABLE "public"."mealOrderFoodItems" ( 
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "mealOrderId" INTEGER NOT NULL,
  "foodItemId" INTEGER NOT NULL,
  CONSTRAINT "mealOrderFoodItems_pkey" PRIMARY KEY ("mealOrderId", "foodItemId")
);
CREATE TABLE "public"."mealOrders" ( 
  "id" SERIAL,
  "userId" INTEGER NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  CONSTRAINT "mealOrders_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "public"."mealWeekdays" ( 
  "id" SERIAL,
  "day" USER-DEFINED NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  CONSTRAINT "mealWeekdays_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "public"."meals" ( 
  "id" SERIAL,
  "dayId" INTEGER NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  CONSTRAINT "meals_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "public"."users" ( 
  "id" SERIAL,
  "fullName" VARCHAR(255) NOT NULL,
  "username" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "password" VARCHAR(255) NOT NULL,
  "role" USER-DEFINED NOT NULL DEFAULT 'GENERAL'::enum_users_role ,
  "isBanned" BOOLEAN NOT NULL DEFAULT false ,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  CONSTRAINT "users_pkey" PRIMARY KEY ("id", "username", "email"),
  CONSTRAINT "users_username_key" UNIQUE ("username"),
  CONSTRAINT "users_email_key" UNIQUE ("email")
);
ALTER TABLE "public"."foodItems" ADD CONSTRAINT "foodItems_foodCategoryId_fkey" FOREIGN KEY ("foodCategoryId") REFERENCES "public"."foodCategories" ("id") ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE "public"."mealFoodItems" ADD CONSTRAINT "mealFoodItems_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "public"."meals" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."mealFoodItems" ADD CONSTRAINT "mealFoodItems_foodItemId_fkey" FOREIGN KEY ("foodItemId") REFERENCES "public"."foodItems" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."mealOrderFoodItems" ADD CONSTRAINT "mealOrderFoodItems_foodItemId_fkey" FOREIGN KEY ("foodItemId") REFERENCES "public"."foodItems" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."mealOrderFoodItems" ADD CONSTRAINT "mealOrderFoodItems_mealOrderId_fkey" FOREIGN KEY ("mealOrderId") REFERENCES "public"."mealOrders" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."meals" ADD CONSTRAINT "meals_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "public"."mealWeekdays" ("id") ON DELETE NO ACTION ON UPDATE CASCADE;


INSERT INTO "public"."users" ("id", "fullName", "username", "email", "password", "role", "isBanned", "createdAt", "updatedAt") VALUES (1, 'mehedi hasan', 'mehedi', 'mehedi@gmail.com', '$2b$10$cO3YWXN5T2FOQyeiHJXz3ewKqPbqxwGUfM8nzDasIC2aZ95vIX3rG', 'GENERAL', false, '2024-07-14 04:46:41.336+00', '2024-07-14 04:46:41.336+00');
