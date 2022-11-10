import { useRef } from 'react'
import { useEffect } from 'react'

import { useAuth } from '@redwoodjs/auth'
import {
  Form,
  Label,
  TextField,
  PasswordField,
  FieldError,
  Submit,
} from '@redwoodjs/forms'
import { Link, navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { toast, Toaster } from '@redwoodjs/web/toast'

const SignupPage = () => {
  const { isAuthenticated, signUp } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.home())
    }
  }, [isAuthenticated])

  // focus on email box on page load
  const usernameRef = useRef(null)
  useEffect(() => {
    usernameRef.current?.focus()
  }, [])

  const onSubmit = async (data) => {
    const response = await signUp({ ...data })

    if (response.message) {
      toast(response.message)
    } else if (response.error) {
      toast.error(response.error)
    } else {
      // user is signed in automatically
      toast.success('Welcome!')
    }
  }

  return (
    <>
      <MetaTags title="Signup" />

      <main className="rw-main">
        <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
        <div className="flex flex-col justify-center bg-slate-50 py-12 pb-32 sm:px-6 lg:px-8">
          <header className="sm:mx-auto sm:w-full sm:max-w-md">
            <img
              className="mx-auto h-12 w-auto"
              src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
              alt="Your Company"
            />

            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Create a new account
            </h2>
          </header>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <Form onSubmit={onSubmit} className="space-y-2">
                <Label
                  name="username"
                  className="block text-sm font-medium text-gray-700"
                  errorClassName="rw-label rw-label-error"
                >
                  Email address
                </Label>
                <TextField
                  name="username"
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  errorClassName="rw-input rw-input-error"
                  ref={usernameRef}
                  validation={{
                    required: true,
                    pattern: {
                      value: /^[^@]+@[^.]+\..+$/,
                      message: 'Please enter a valid email address',
                    },
                  }}
                />

                <FieldError name="username" className="rw-field-error" />

                <Label
                  name="password"
                  className="block text-sm font-medium text-gray-700"
                  errorClassName="rw-label rw-label-error"
                >
                  Password
                </Label>
                <PasswordField
                  name="password"
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  errorClassName="rw-input rw-input-error"
                  autoComplete="current-password"
                  validation={{
                    required: {
                      value: true,
                      message: 'Password is required',
                    },
                  }}
                />

                <FieldError name="password" className="rw-field-error" />

                <div className="py-4">
                  <Submit className="flex w-full justify-center rounded-md bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    Sign Up
                  </Submit>
                </div>
              </Form>
            </div>
            <div className="rw-login-link">
              <span>Already have an account?</span>{' '}
              <Link to={routes.login()} className="rw-link">
                Log in!
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default SignupPage
