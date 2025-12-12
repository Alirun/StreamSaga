'use client'

import Link from "next/link";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordReset } from "../actions";

interface ActionState {
    error: string | null;
    success: boolean;
    message: string | null;
}

const initialState: ActionState = {
    error: null,
    success: false,
    message: null,
};

export default function ForgotPasswordPage() {
    const [state, formAction, isPending] = useActionState(async (prevState: ActionState, formData: FormData) => {
        return await requestPasswordReset(formData);
    }, initialState);

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">Forgot password?</CardTitle>
                <CardDescription>
                    Enter your email and we&apos;ll send you a reset link
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {state?.success ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-center">
                            <div className="rounded-full bg-green-500/10 p-3">
                                <Mail className="h-6 w-6 text-green-500" />
                            </div>
                        </div>
                        <div className="p-4 text-sm text-green-500 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
                            {state.message}
                        </div>
                        <p className="text-sm text-muted-foreground text-center">
                            Didn&apos;t receive an email? Check your spam folder or try again.
                        </p>
                    </div>
                ) : (
                    <form action={formAction} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                autoFocus
                            />
                        </div>
                        {state?.error && (
                            <p className="text-sm text-red-500">{state.error}</p>
                        )}
                        <Button className="w-full" size="lg" disabled={isPending}>
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Send Reset Link
                        </Button>
                    </form>
                )}
            </CardContent>
            <CardFooter>
                <div className="text-sm text-muted-foreground text-center w-full">
                    <Link href="/login" className="text-primary hover:underline inline-flex items-center gap-1">
                        <ArrowLeft className="h-3 w-3" />
                        Back to sign in
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
}
