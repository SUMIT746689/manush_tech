import { API_KEY } from '@/secret';
import { Brand, CreateBrand, UpdateBrand } from '@/types/week_day';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

type GetAllMealWeekDaysType = {
  data: Brand[] | [];
  meta: {
    page: number
  }
}

export const mealWeekDayApi = createApi({
  reducerPath: 'brandApi',
  tagTypes: ['MealWeekDays'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_KEY}/meal_week_days`,
    credentials: 'include'
  }),
  // refetchOnReconnect: true,
  endpoints: (builder) => ({
    getAllBrand: builder.query<GetAllMealWeekDaysType | [], void>({
      query: () => ('/'),
      transformResponse: (response: GetAllMealWeekDaysType) => response,
      providesTags: [{ type: "MealWeekDays", id: "LIST" }],
    }),
    createBrand: builder.mutation<Brand, CreateBrand>({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body
      }),
      invalidatesTags: [{ type: "MealWeekDays", id: "LIST" }],
      // transformResponse: (result: { data: { users: any } }) =>result.data.users)
    }),

    updateBrand: builder.mutation<string, { id: number, body: UpdateBrand }>({
      query: ({ id, body }) => ({
        url: `/${JSON.stringify(id)}`,
        method: 'PATCH',
        body,
        responseHandler: (response) => response.text(),
      }),
      invalidatesTags: [{ type: "MealWeekDays", id: "LIST" }],
    }),

    deleteBrand: builder.mutation<string, number>({
      query: (user_id) => ({
        url: `/${JSON.stringify(user_id)}`,
        method: 'DELETE',
        responseHandler: (response) => response.text(),
      }),
      invalidatesTags: ['MealWeekDays']
    }),
  }),

})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetAllBrandQuery, useCreateBrandMutation, useUpdateBrandMutation, useDeleteBrandMutation } = mealWeekDayApi;