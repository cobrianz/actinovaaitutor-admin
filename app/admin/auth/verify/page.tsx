"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

const verifySchema = z.object({
    email: z.string().email("Invalid email address"),
    code: z.string().min(6, "Code must be at least 6 characters"),
})

type VerifyForm = z.infer<typeof verifySchema>

export default function VerifyPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<VerifyForm>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            email: searchParams.get("email") || "",
        },
    })

    const onSubmit = async (data: VerifyForm) => {
        setIsLoading(true)
        setError("")
        setSuccess("")

        try {
            const response = await fetch("/api/auth/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || "Verification failed")
            }

            setSuccess("Account verified successfully! Redirecting to login...")
            setTimeout(() => {
                router.push("/admin/auth/login")
            }, 2000)
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Verify Account</CardTitle>
                <CardDescription>Enter the verification code sent to your email</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="code">Verification Code</Label>
                        <Input
                            id="code"
                            placeholder="Enter 6-digit code"
                            {...register("code")}
                        />
                        {errors.code && (
                            <p className="text-sm text-red-500">{errors.code.message}</p>
                        )}
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {success && (
                        <Alert>
                            <AlertDescription>{success}</AlertDescription>
                        </Alert>
                    )}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Verify Account
                    </Button>
                </form>

                <div className="mt-4 text-center text-sm">
                    <Link href="/admin/auth/login" className="text-primary hover:underline">
                        Back to Login
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
