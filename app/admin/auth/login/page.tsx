"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const loginSchema = z.object({
    emailOrPhone: z.string().min(1, "Email or Phone is required"),
    password: z.string().min(1, "Password is required"),
    secretKey2: z.string().min(1, "Secret key 2 is required"),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showSecretKey2, setShowSecretKey2] = useState(false)

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: LoginForm) => {
        setIsLoading(true)
        setError("")

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            const result = await response.json()

            if (!response.ok) {
                // Handling specific errors
                if (response.status === 401 && result.error.includes("verify")) {
                    // Not verified -> Redirect to verify
                    const email = data.emailOrPhone.includes("@") ? data.emailOrPhone : ""
                    toast.error("Account not verified. Redirecting...")
                    setTimeout(() => {
                        router.push(`/admin/auth/verify?email=${encodeURIComponent(email)}`)
                    }, 1500)
                    return
                }

                if (response.status === 403 && result.error.includes("approval")) {
                    // Not approved -> Toast
                    toast.warning("Account pending approval. Please contact system administrator.")
                    throw new Error(result.error)
                }

                throw new Error(result.error || "Login failed")
            }

            localStorage.setItem("adminToken", result.token)
            localStorage.setItem("adminUser", JSON.stringify(result.admin))

            toast.success("Welcome back!")
            router.push("/admin")
            router.refresh()
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Admin Login</CardTitle>
                <CardDescription>Enter credentials to access dashboard</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="emailOrPhone">Email or Phone</Label>
                        <Input
                            id="emailOrPhone"
                            placeholder="Enter email or phone"
                            {...register("emailOrPhone")}
                        />
                        {errors.emailOrPhone && (
                            <p className="text-sm text-red-500">{errors.emailOrPhone.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            <Link
                                href="/admin/auth/forgot-password"
                                className="text-sm font-medium text-primary hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter password"
                                {...register("password")}
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-sm text-red-500">{errors.password.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="secretKey2">Secret Key 2</Label>
                        <div className="relative">
                            <Input
                                id="secretKey2"
                                type={showSecretKey2 ? "text" : "password"}
                                placeholder="Enter secret key 2"
                                {...register("secretKey2")}
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowSecretKey2(!showSecretKey2)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showSecretKey2 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.secretKey2 && (
                            <p className="text-sm text-red-500">{errors.secretKey2.message}</p>
                        )}
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Sign In
                    </Button>
                </form>

                <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/admin/auth/signup" className="text-primary hover:underline">
                        Sign up
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
