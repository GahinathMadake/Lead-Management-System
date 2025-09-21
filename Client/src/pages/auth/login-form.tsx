import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import axios, { AxiosError } from "axios"
import { toast } from "react-toastify"
import type { Response } from "@/Interfaces/Response"
import { useUser } from "@/context/authContext"

export function LoginForm() {
  const navigate = useNavigate();

  const { fetchUser } = useUser();
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [formData, setFormData] = useState({ email: "", password: "" })

  // Handle input changes
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  // Submit handler
  async function submitHandler(event: React.FormEvent) {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await axios.post<Response>(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, formData,
        { withCredentials: true }
      );

      if (res.data.success === false) {
        console.log("❌ Login failed:", res.data.message);
        toast.error(res.data.message || "Login failed. Please try again.");
      }
      else {
        setFormData({ email: "", password: "" });
        toast.success("Login successful!");

        setTimeout(async () => {
          await fetchUser();
          navigate("/");
        }, 200);
      }
    } catch (err) {
      const error = err as AxiosError<Response>;
      console.error(error);
      if (error.response?.data) {
        toast.error(error.response.data.error || "Failed to Login.");
      } else {
        toast.error("Network error. Please try again.");
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={submitHandler} className="p-6 md:p-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground text-balance">
            Login to your Acme Inc account
          </p>
        </div>

        {/* Email */}
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              to="/forgot-password"
              className="ml-auto text-sm underline-offset-2 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Submit button */}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>

        {/* Social logins */}
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-card text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Button variant="outline" type="button" className="w-full">
            Apple
          </Button>
          <Button variant="outline" type="button" className="w-full">
            Google
          </Button>
          <Button variant="outline" type="button" className="w-full">
            Meta
          </Button>
        </div>

        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/sign-up" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </div>
    </form>
  )
}
