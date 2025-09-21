import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"
import axios, { AxiosError } from "axios"
import { toast } from "react-toastify"
import { Mail } from "lucide-react";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import type { Response } from "@/Interfaces/Response"


export default function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [otpSent, setOtpSent] = useState(false)
    const [otp, setOtp] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    
    const requestOtpHandler = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) {
            toast.error("Please enter your email")
            return
        }

        setIsSubmitting(true);

        try {
            const res = await axios.post<Response>(
                `${import.meta.env.VITE_BACKEND_URL}/auth/forgot-password`,
                { email }
            )

            if (res.data.success) {
                toast.success(res.data.message || "OTP sent to your email!")
                setOtpSent(true)
            } else {
                toast.error(res.data.message || "Something went wrong!")
            }
        } catch (err) {
            const error = err as AxiosError<Response>
            if (error.response?.data) {
                toast.error(error.response.data.error || "Failed to send OTP.")
            } else {
                toast.error("Network error. Please try again.")
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const resetPasswordHandler = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!otp || !password || !confirmPassword) {
            toast.error("All fields are required")
            return
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        setIsSubmitting(true)
        try {
            const res = await axios.post<Response>(
                `${import.meta.env.VITE_BACKEND_URL}/auth/reset-password`,
                { email, otp, password, confirmPassword }
            )

            if (res.data.success) {
                toast.success(res.data.message || "Password reset successful!")
                setOtp("")
                setPassword("")
                setConfirmPassword("")
                setOtpSent(false) // back to login
            } else {
                toast.error(res.data.message || "Reset failed.")
            }
        } catch (err) {
            const error = err as AxiosError<Response>
            if (error.response?.data) {
                toast.error(error.response.data.error || "Failed to reset password.")
            } else {
                toast.error("Network error. Please try again.")
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
            <div className="flex flex-col items-center mb-6">
                <span className="text-2xl font-bold text-gray-900">⚡</span>
                <h1 className="mt-2 text-xl font-semibold text-gray-900">
                    {otpSent ? "Reset Password" : "Forgot Password?"}
                </h1>
            </div>

            {!otpSent ? (
                // Step 1: Request OTP
                <form onSubmit={requestOtpHandler} className="space-y-5">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative mt-1">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                className="pl-10"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-md bg-black text-white hover:bg-gray-800"
                    >
                        {isSubmitting ? "Sending..." : "Send OTP"}
                    </Button>
                </form>
            ) : (
                <form onSubmit={resetPasswordHandler} className="space-y-5">

                    <div className="grid gap-3">
                        <Label htmlFor="otp">Enter OTP</Label>
                        <InputOTP
                            id="otp"
                            maxLength={6}
                            value={otp}
                            onChange={(value) => setOtp(value)}
                        >
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>

                        <div className="text-center text-sm text-muted-foreground">
                            {otp === "" ? "Enter your one-time password." : `You entered: ${otp}`}
                        </div>
                    </div>

                    <div  className="grid gap-2">
                        <Label htmlFor="password">New Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div  className="grid gap-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-md bg-black text-white hover:bg-gray-800"
                    >
                        {isSubmitting ? "Resetting..." : "Reset Password"}
                    </Button>
                </form>
            )}

            <div className="mt-4 text-center">
                <Link to="/login" className="text-sm text-indigo-600 hover:underline">
                    Back to Login
                </Link>
            </div>
        </div>
    )
}

