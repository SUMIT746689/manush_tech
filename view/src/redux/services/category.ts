import { API_KEY } from '@/secret';
import { Category, CreateCategory, UpdateCategory } from '@/types/category';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

type GetAllCategoriesType = {
  data: Category[] | [];
  meta: {
    page: number
  }
}

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  tagTypes: ['Categories'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_KEY}/food_categories`,
    credentials: 'include'
  }),
  // refetchOnReconnect: true,
  endpoints: (builder) => ({
    getAllCategory: builder.query<GetAllCategoriesType, string>({
      query: () => (`/`),
      transformResponse: (response: GetAllCategoriesType) => response,
      providesTags: [{ type: "Categories", id: "LIST" }],
    }),
    createCategory: builder.mutation<Category, CreateCategory>({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body
      }),
      invalidatesTags: [{ type: "Categories", id: "LIST" }],
      // transformResponse: (result: { data: { users: any } }) =>result.data.users)
    }),

    updateCategory: builder.mutation<string, { id: number, body: UpdateCategory }>({
      query: ({ id, body }) => ({
        url: `/${JSON.stringify(id)}`,
        method: 'PATCH',
        body,
        responseHandler: (response) => response.text(),
      }),
      invalidatesTags: [{ type: "Categories", id: "LIST" }],
    }),

    deleteCategory: builder.mutation<string, number>({
      query: (user_id) => ({
        url: `/${JSON.stringify(user_id)}`,
        method: 'DELETE',
        responseHandler: (response) => response.text(),
      }),
      invalidatesTags: ['Categories']
    }),
  }),

})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetAllCategoryQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation } = categoryApi;