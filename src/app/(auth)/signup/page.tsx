'use client'

import Link from "next/link";
import { Twitch, Loader2 } from "lucide-react";
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
import { signup, signInWithTwitch } from "../actions";

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

export default function SignupPage() {
    const [state, formAction, isPending] = useActionState(async (prevState: ActionState, formData: FormData) => {
        return await signup(formData);
    }, initialState);

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                <CardDescription>
                    Enter your email below to create your account
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <form action={signInWithTwitch}>
                    <Button className="w-full bg-[#9146FF] hover:bg-[#7d2eff] text-white" size="lg">
                        <Twitch className="mr-2 h-4 w-4" />
                        Sign up with Twitch
                    </Button>
                </form>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>
                <form action={formAction} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" placeholder="John Doe" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" required />
                    </div>
                    {state?.error && (
                        <p className="text-sm text-red-500">{state.error}</p>
                    )}
                    {state?.success && (
                        <div className="p-3 text-sm text-green-500 bg-green-50 border border-green-200 rounded-md">
                            {state.message}
                        </div>
                    )}
                    <Button className="w-full" size="lg" disabled={isPending || state?.success}>
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Sign Up
                    </Button>
                </form>
            </CardContent>
            <CardFooter>
                <div className="text-sm text-muted-foreground text-center w-full">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary hover:underline">
                        Sign in
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
}
