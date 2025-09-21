import LandingPageLayout from '@/components/common/LandingPageLayout';
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import login from "@/assets/login 1.png"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useUser } from "@/context/authContext"
import React from 'react'

interface AuthTemplateProps {
  children: React.ReactNode
}

export default function LoginSignUpLayout({ children }: AuthTemplateProps) {
  const { user } = useUser();
  const navigate = useNavigate();

  if (user) {
    toast.info("You are already logged in.");
    navigate("/");
  }

  return (
    <LandingPageLayout>
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl">
          <div className={cn("flex flex-col gap-6")}>
            <Card className="overflow-hidden p-0">
              <CardContent className="grid p-0 md:grid-cols-2">
                
                <>
                 {children}
                </>

                {/* Right-side image */}
                <div className="bg-muted relative hidden md:block">
                  <img
                    src={login}
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
              By clicking continue, you agree to our <Link to="#">Terms of Service</Link>{" "}
              and <Link to="#">Privacy Policy</Link>.
            </div>
          </div>
        </div>
      </div>
    </LandingPageLayout>
  )
}

