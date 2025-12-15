'use client'

import Link from "next/link";
import { ArrowLeft, Loader2, KeyRound } from "lucide-react";
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
import { updatePassword } from "../actions";

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

export function ResetPasswordForm() {
    const [state, formAction, isPending] = useActionState(async (prevState: ActionState, formData: FormData) => {
        return await updatePassword(formData);
    }, initialState);

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
                <div className="flex items-center justify-center mb-2">
                    <div className="rounded-full bg-primary/10 p-3">
                        <KeyRound className="h-6 w-6 text-primary" />
                    </div>
                </div>
                <CardTitle className="text-2xl font-bold text-center">Set new password</CardTitle>
                <CardDescription className="text-center">
                    Enter your new password below
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <form action={formAction} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            required
                            minLength={6}
                            autoFocus
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>
                    {state?.error && (
                        <p className="text-sm text-red-500">{state.error}</p>
                    )}
                    <Button className="w-full" size="lg" disabled={isPending}>
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Update Password
                    </Button>
                </form>
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
