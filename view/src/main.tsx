import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom'
import Login from './routes/login.tsx'
// import { LoginRouteAction } from './routes/login.tsx'
import { isLoggedIn } from './lib/auth.ts'
// import Layout, { LayoutRouteAction } from './content/layout/Layout.tsx'
import Layout from './content/layout/Layout.tsx'
import Dashboard from './routes/dashboard.tsx'
import UserIndex from './routes/users/index.tsx'
// import { userList } from './repository/user.ts'
import { Provider } from 'react-redux'
import { store } from './redux/store.ts'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications';
import ErrorBoundary from './components/ErrorBoundary.tsx'
import MealWeekDays from './routes/meal_week_days.tsx'
import Categories from './routes/categories.tsx'
import FoodItems from './routes/food_items.tsx'
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    // loader: async ({ request }) => {
    //   if (!await isLoggedIn()) return redirect('/login')
    //   if (new URL(request.url).pathname === "/") return redirect('/dashboard')
    //   return null
    // },
    // action: LayoutRouteAction,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
        loader: async () => {
          if (!await isLoggedIn()) {
            return redirect("/login")
          }
          return null
        },
      },
      {
        path: "/users",
        element: <UserIndex />,
        loader: async () => {
          if (!await isLoggedIn()) {
            return redirect("/login")
          }
          // return await userList()
          return null
        },
      },
      {
        path: "/categories",
        element: <Categories />,
        loader: async () => {
          if (!await isLoggedIn()) {
            return redirect("/login")
          }
          // return await userList()
          return null
        },
      },
      {
        path: "/food_items",
        element: <FoodItems />,
        loader: async () => {
          if (!await isLoggedIn()) {
            return redirect("/login")
          }
          // return await userList()
          return null
        },
      },
      {
        path: "/meal_week_days",
        element: <MealWeekDays />,
        loader: async () => {
          if (!await isLoggedIn()) {
            return redirect("/login")
          }
          // return await userList()
          return null
        },
      },
    ],
  },

  {
    path: "/login",
    element: <Login />,
    // action: LoginRouteAction,
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <Notifications />
        <RouterProvider router={router} />
      </MantineProvider>
    </Provider>
  </React.StrictMode>,
)
