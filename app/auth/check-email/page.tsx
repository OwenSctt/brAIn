import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl text-slate-100">Check Your Email</CardTitle>
            <CardDescription className="text-slate-400">We&apos;ve sent you a confirmation link</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-300 text-center">
              Please check your email and click the confirmation link to activate your account and start learning.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
