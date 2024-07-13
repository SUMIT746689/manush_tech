import { API_KEY } from '@/secret';
import { CreateUser, UpdateUser, User } from '@/types/users'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

type GetAllUsersType = {
  data: User[] | [];
  meta: {
    page: number
  }
}

export const userApi = createApi({
  reducerPath: 'userApi',
  tagTypes: ['Users'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_KEY}/users`,
    credentials: 'include'
  }),
  // refetchOnReconnect: true,
  endpoints: (builder) => ({
    getAllUsers: builder.query<GetAllUsersType, void>({
      query: () => ("/"),
      transformResponse: (response: GetAllUsersType) => response,
      providesTags: [{ type: "Users", id: "LIST" }],
    }),
    createUser: builder.mutation<User, CreateUser>({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body,
        // headers: { "Content-Type": "text/plain" }
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
      // transformResponse: (result: { data: { users: any } }) =>result.data.users)
    }),

    updateUser: builder.mutation<User, UpdateUser>({
      query: ({ user_id, body }) => ({
        url: `/${JSON.stringify(user_id)}`,
        method: 'PATCH',
        body,
        responseHandler: (response) => response.text(),
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
    deleteUser: builder.mutation<string, number>({
      query: (user_id) => ({
        url: `/${JSON.stringify(user_id)}`,
        method: 'DELETE',
        responseHandler: (response) => response.text(),
      }),
      invalidatesTags: ['Users']
    }),
  }),

})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetAllUsersQuery, useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation } = userApi;