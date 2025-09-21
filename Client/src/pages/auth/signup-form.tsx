import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeClosed } from "lucide-react"
import { useState } from "react"
import { toast } from "react-toastify"
import { type Response } from "@/Interfaces/Response"
import axios, { AxiosError } from "axios";


export function SignUpForm() {

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [otpSent, setOtpSent] = useState<boolean>(false);
    const [sendingOtp, setSendingOtp] = useState<boolean>(false);
    const [creatingUser, setCreatingUser] = useState<boolean>(false);


    const [formData, setFormData] = useState({
        fname: "",
        lname: "",
        email: "",
        phone: "",
        password: "",
        otp: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleOtpChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            otp: value,
        }));
    };

    async function otpSentHandller() {
        try {
            setSendingOtp(true);

            const response = await axios.post<Response>(`${import.meta.env.VITE_BACKEND_URL}/auth/send-otp`,
                { email: formData.email }
            );

            if (response.data.success) {
                toast.success("OTP sent Successfully 🎉");
                setOtpSent(true);
            }
            else {
                toast.error(response.data.message || "Failed to sent OTP. Please try again.");
            }
        }
        catch (err) {
            const error = err as AxiosError<Response>;
            console.error(error);
            if (error.response?.data) {
                toast.error(error.response.data.error || "Failed to sent OTP.");
            } else {
                toast.error("Network error. Please try again.");
            }
        }
        finally {
            setTimeout(() => {
                setSendingOtp(false);
            }, 500);
        }
    }

    async function creatUserHandller() {
        try {
            setCreatingUser(true);

            const response = await axios.post<Response>(`${import.meta.env.VITE_BACKEND_URL}/auth/create-user`,
                formData
            );

            if (response.data.success) {
                toast.success("User created successfully🎉! Please login to continue.");

                navigate("/login");
            }
            else {
                toast.error(response.data.message || "Failed to create user. Please try again.");
            }
        } catch (err) {
            const error = err as AxiosError<Response>;
            console.error(error);
            if (error.response?.data) {
                toast.error(error.response.data.error || "Failed to create user.");
            } else {
                toast.error("Network error. Please try again.");
            }
        }
        finally {
            setTimeout(() => {
                setCreatingUser(false);
            }, 500);
        }
    }



    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            creatUserHandller();
        }}
            className="p-6 md:p-8 border">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Create Accout</h1>
                    <p className="text-muted-foreground">
                        Create your account to get started.
                    </p>
                </div>

                {
                    otpSent ?
                        <>
                            <div className="text-center text-md">
                                OTP has been sent to <span className="font-semibold">{formData.email}</span>
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="otp">Enter OTP</Label>
                                <InputOTP
                                    maxLength={6}
                                    value={formData.otp}
                                    onChange={handleOtpChange}
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
                                <div className="text-center text-sm">
                                    {formData.otp === ""
                                        ? "Enter your one-time password."
                                        : `You entered: ${formData.otp}`}
                                </div>
                            </div>

                            <Button
                                type="submit"
                                onClick={creatUserHandller}
                                className="w-full"
                                disabled={creatingUser}

                            >
                                {creatingUser ? "Sending OTP..." : "Create Account"}
                            </Button>

                        </>
                        :
                        <>
                            <div className="grid gap-3">
                                <Label htmlFor="fname">First Name</Label>
                                <Input
                                    id="fname"
                                    type="text"
                                    placeholder="John"
                                    required
                                    value={formData.fname}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="lname">Last Name</Label>
                                <Input
                                    id="lname"
                                    type="text"
                                    placeholder="Doe"
                                    required
                                    value={formData.lname}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="johndoe@gmail.com"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="phone">Mobile Number</Label>
                                <div className="flex items-center rounded-md border border-input bg-background px-3 py-1">
                                    <span className="text-muted-foreground mr-2 select-none">
                                        +91
                                    </span>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        pattern="[0-9]{10}"
                                        maxLength={10}
                                        placeholder="Enter 10-digit mobile number"
                                        className="border-none shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-full"
                                        required
                                        value={formData.phone}
                                        onInput={(e) => {
                                            const input = e.target as HTMLInputElement;
                                            input.value = input.value.replace(/[^0-9]/g, "");
                                            handleChange(e as any);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-3 relative">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="pr-10"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
                                </button>
                            </div>

                            <Button
                                type="button"
                                onClick={otpSentHandller}
                                className="w-full"
                                disabled={sendingOtp}
                            >
                                {sendingOtp ? "Sending OTP..." : "Send OTP"}
                            </Button>

                        </>

                }


                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                    <span className="bg-card text-muted-foreground relative z-10 px-2">
                        Or
                    </span>
                </div>

                <div className="text-center text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="underline underline-offset-4">
                        login
                    </Link>
                </div>
            </div>
        </form>
    )
}
