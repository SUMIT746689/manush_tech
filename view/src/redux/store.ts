import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import { userApi } from './services/user'
import { authApi } from './services/auth';
import { categoryApi } from './services/category';
import { foodItemApi } from './services/food_items';
import { mealWeekDayApi } from './services/meal_week_days';

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [foodItemApi.reducerPath]: foodItemApi.reducer,
    [mealWeekDayApi.reducerPath]: mealWeekDayApi.reducer
  },
  devTools: true,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(userApi.middleware)
    .concat(authApi.middleware)
    .concat(categoryApi.middleware)
    .concat(foodItemApi.middleware)
    .concat(mealWeekDayApi.middleware)
});


setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch