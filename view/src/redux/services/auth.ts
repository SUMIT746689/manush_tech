import { API_KEY } from '@/secret'
import { AuthLogIn, AuthUser } from '@/types/auth'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const authApi = createApi({
  reducerPath: 'authApi',
  
  tagTypes: ['Auth',],
  baseQuery: fetchBaseQuery({baseUrl: `${API_KEY}/auth`,}),
  endpoints: (builder) => ({
    loginUser: builder.mutation<AuthLogIn, { username: string, password: string }>({
      query: (body) => ({
        url: 'login',
        method: 'POST',
        body
      }),
      transformErrorResponse: (baseQueryReturnValue) => baseQueryReturnValue.data || 'Failed to Login',
      // invalidatesTags:["Auth"]
    }),
    logoutUser: builder.mutation<string, void>({
      query: (body) => ({
        url: 'logout',
        method: 'POST',
        body
      }),
      onQueryStarted() {
        document.cookie = `Authorization=`
      },
      transformErrorResponse: (baseQueryReturnValue) => baseQueryReturnValue.data || 'Failed to Logout',
      invalidatesTags: ["Auth"]
    }),

    authUser: builder.query<AuthUser, void>({
      query: () => ({
        url: 'verify',
        credentials: 'include',
      }),
      transformResponse: (response: { user: AuthUser }) => response.user,
      providesTags: ['Auth']
    }),
  }),

})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLoginUserMutation, useLogoutUserMutation, useAuthUserQuery } = authApi