"use client";
import { ArrowLeft } from "lucide-react"
import { LoginForm } from "@/components/login-form"
// Use the correct import based on the package you want to keep
import { motion } from "motion/react"
import Link from "next/link";
export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <motion.div
            className="flex items-center text-muted-foreground"
             initial={{ backgroundSize: "0% 2px" }}
             whileHover={{ backgroundSize: "100% 2px" }}
             transition={{ duration: 0.3 }}
             style={{
               backgroundImage: "linear-gradient(currentColor, currentColor)",
               backgroundPosition: "0 100%",
               backgroundRepeat: "no-repeat"
             }} >
          <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
            </motion.div>
           
            
                      </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
      </div>
    </div>
  );
}