import { API_KEY } from '@/secret';
import { CreateFoodItem, FoodItem, UpdateFoodItem } from '@/types/food_item';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

type GetAllFoodItemType = {
  data: FoodItem[] | [];
  meta: {
    page: number
  }
}

export const foodItemApi = createApi({
  reducerPath: 'foodItemApi',
  tagTypes: ['FoodItems'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_KEY}/food_items`,
    credentials: 'include'
  }),
  // refetchOnReconnect: true,
  endpoints: (builder) => ({
    getAllFoodItem: builder.query<GetAllFoodItemType, void>({
      query: () => ('/'),
      transformResponse: (response: GetAllFoodItemType) => response,
      providesTags: [{ type: "FoodItems", id: "LIST" }],
    }),
    createFoodItem: builder.mutation<FoodItem, CreateFoodItem>({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body
      }),
      invalidatesTags: [{ type: "FoodItems", id: "LIST" }],
      // transformResponse: (result: { data: { users: any } }) =>result.data.users)
    }),

    updateFoodItem: builder.mutation<string, { id: number, body: UpdateFoodItem }>({
      query: ({ id, body }) => ({
        url: `/${JSON.stringify(id)}`,
        method: 'PATCH',
        body,
        responseHandler: (response) => response.text(),
      }),
      invalidatesTags: [{ type: "FoodItems", id: "LIST" }],
    }),

    deleteFoodItem: builder.mutation<string, number>({
      query: (user_id) => ({
        url: `/${JSON.stringify(user_id)}`,
        method: 'DELETE',
        responseHandler: (response) => response.text(),
      }),
      invalidatesTags: ['FoodItems']
    }),
  }),

})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetAllFoodItemQuery, useCreateFoodItemMutation, useUpdateFoodItemMutation, useDeleteFoodItemMutation } = foodItemApi;