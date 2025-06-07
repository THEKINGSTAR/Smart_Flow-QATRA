"use client"

import { useState, useEffect } from "react"
import { useLocation } from "wouter"
import { useAuth, loginSchema, registerSchema } from "@/hooks/use-auth"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { z } from "zod"

export default function AuthPage() {
  const [location, navigate] = useLocation()
  const { user, loginMutation, registerMutation, oauthLoginMutation } = useAuth()
  const [activeTab, setActiveTab] = useState<string>("login")
  const [oauthError, setOauthError] = useState<string | null>(null)

  // Define login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  // Define register form
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  // Handle login submission
  const onLoginSubmit = (data: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        navigate("/")
      },
    })
  }

  // Handle register submission
  const onRegisterSubmit = (data: z.infer<typeof registerSchema>) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        navigate("/")
      },
    })
  }

  // Handle OAuth login
  const handleOAuthLogin = (provider: string) => {
    setOauthError(null)

    // For demonstration, we'll use the mutation directly
    // In a real implementation, this would redirect to the OAuth provider
    if (provider === "demo") {
      oauthLoginMutation.mutate(
        { provider, token: "demo-token" },
        {
          onSuccess: () => {
            navigate("/")
          },
          onError: (error) => {
            setOauthError(error.message)
          },
        },
      )
    } else {
      // In a real implementation, this would redirect to the OAuth provider
      window.location.href = `/api/auth/${provider}`
    }
  }

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/")
    }
  }, [user, navigate])

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center">
            <i className="ri-droplet-fill text-2xl"></i>
          </div>
        </div>
        <h2 className="mt-3 text-center text-3xl font-extrabold font-heading text-gray-900">SmartFlow</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join our community to help report and reduce water leakage
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-5xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Auth Forms */}
            <div>
              {oauthError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{oauthError}</AlertDescription>
                </Alert>
              )}

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-4 grid grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl font-medium font-heading">Login to your account</CardTitle>
                      <CardDescription>Enter your credentials to access your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* OAuth Login Buttons */}
                        <div className="grid grid-cols-1 gap-3">
                          <Button
                            variant="outline"
                            type="button"
                            onClick={() => handleOAuthLogin("google")}
                            className="flex items-center justify-center"
                          >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                              <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                              />
                              <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                              />
                              <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                              />
                              <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                              />
                            </svg>
                            Continue with Google
                          </Button>

                          <Button
                            variant="outline"
                            type="button"
                            onClick={() => handleOAuthLogin("apple")}
                            className="flex items-center justify-center"
                          >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
                            </svg>
                            Continue with Apple
                          </Button>

                          <Button
                            variant="outline"
                            type="button"
                            onClick={() => handleOAuthLogin("microsoft")}
                            className="flex items-center justify-center"
                          >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                              <path fill="#f25022" d="M1 1h10v10H1z" />
                              <path fill="#00a4ef" d="M1 13h10v10H1z" />
                              <path fill="#7fba00" d="M13 1h10v10H13z" />
                              <path fill="#ffb900" d="M13 13h10v10H13z" />
                            </svg>
                            Continue with Microsoft
                          </Button>

                          <Button
                            variant="outline"
                            type="button"
                            onClick={() => handleOAuthLogin("demo")}
                            className="flex items-center justify-center"
                          >
                            <i className="ri-user-line mr-2"></i>
                            Demo Login (Instant Access)
                          </Button>
                        </div>

                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <Separator className="w-full" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
                          </div>
                        </div>

                        <Form {...loginForm}>
                          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                            <FormField
                              control={loginForm.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Username</FormLabel>
                                  <FormControl>
                                    <Input placeholder="yourusername" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={loginForm.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="••••••••" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                              {loginMutation.isPending ? (
                                <span className="flex items-center">
                                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                                  Logging in...
                                </span>
                              ) : (
                                "Login"
                              )}
                            </Button>
                          </form>
                        </Form>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                      <Button variant="link" onClick={() => setActiveTab("register")}>
                        Don't have an account? Register
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="register">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl font-medium font-heading">Create an account</CardTitle>
                      <CardDescription>Join SmartFlow to track your reports and earn rewards</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* OAuth Register Buttons */}
                        <div className="grid grid-cols-1 gap-3">
                          <Button
                            variant="outline"
                            type="button"
                            onClick={() => handleOAuthLogin("google")}
                            className="flex items-center justify-center"
                          >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                              <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                              />
                              <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                              />
                              <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                              />
                              <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                              />
                            </svg>
                            Sign up with Google
                          </Button>

                          <Button
                            variant="outline"
                            type="button"
                            onClick={() => handleOAuthLogin("apple")}
                            className="flex items-center justify-center"
                          >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
                            </svg>
                            Sign up with Apple
                          </Button>

                          <Button
                            variant="outline"
                            type="button"
                            onClick={() => handleOAuthLogin("microsoft")}
                            className="flex items-center justify-center"
                          >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                              <path fill="#f25022" d="M1 1h10v10H1z" />
                              <path fill="#00a4ef" d="M1 13h10v10H1z" />
                              <path fill="#7fba00" d="M13 1h10v10H13z" />
                              <path fill="#ffb900" d="M13 13h10v10H13z" />
                            </svg>
                            Sign up with Microsoft
                          </Button>
                        </div>

                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <Separator className="w-full" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-muted-foreground">Or register with email</span>
                          </div>
                        </div>

                        <Form {...registerForm}>
                          <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                            <FormField
                              control={registerForm.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Username</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Choose a username" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={registerForm.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input type="email" placeholder="your@email.com" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={registerForm.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="••••••••" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={registerForm.control}
                              name="confirmPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Confirm Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="••••••••" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                              {registerMutation.isPending ? (
                                <span className="flex items-center">
                                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                                  Creating account...
                                </span>
                              ) : (
                                "Register"
                              )}
                            </Button>
                          </form>
                        </Form>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                      <Button variant="link" onClick={() => setActiveTab("login")}>
                        Already have an account? Login
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Hero Section */}
            <div className="hidden md:block bg-primary-50 rounded-lg p-8">
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center">
                  <i className="ri-water-flash-line text-3xl"></i>
                </div>
              </div>
              <h3 className="text-2xl font-bold font-heading text-primary-800 text-center mb-4">
                Join the Water Conservation Movement
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <i className="ri-map-pin-line text-xl text-primary-600"></i>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-primary-900">Report Leaks with Precision</h4>
                    <p className="mt-1 text-sm text-primary-700">
                      Use geolocation to accurately report water leaks anywhere in your community.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <i className="ri-wifi-off-line text-xl text-primary-600"></i>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-primary-900">Works Offline</h4>
                    <p className="mt-1 text-sm text-primary-700">
                      Submit reports even without an internet connection. We'll sync when you're back online.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <i className="ri-medal-line text-xl text-primary-600"></i>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-primary-900">Earn Achievements</h4>
                    <p className="mt-1 text-sm text-primary-700">
                      Get recognized for your contributions with badges and points as you help save water.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <i className="ri-notification-3-line text-xl text-primary-600"></i>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-primary-900">Stay Updated</h4>
                    <p className="mt-1 text-sm text-primary-700">
                      Receive notifications when your reported leaks are addressed by authorities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
