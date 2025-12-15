'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Twitch, Loader2, Wallet } from "lucide-react";
import { useActionState, useState } from "react";

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
import { createClient } from "@/lib/supabase/client";
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

export function SignupForm() {
    const router = useRouter();
    const [web3Error, setWeb3Error] = useState<string | null>(null);
    const [isWeb3Loading, setIsWeb3Loading] = useState(false);

    const [state, formAction, isPending] = useActionState(async (prevState: ActionState, formData: FormData) => {
        return await signup(formData);
    }, initialState);

    const handleWeb3SignIn = async () => {
        setWeb3Error(null);
        setIsWeb3Loading(true);

        try {
            const supabase = createClient();
            const { error } = await supabase.auth.signInWithWeb3({
                chain: 'ethereum',
            });

            if (error) {
                setWeb3Error(error.message);
            } else {
                router.push('/');
                router.refresh();
            }
        } catch {
            if (typeof window !== 'undefined' && !(window as Window & { ethereum?: unknown }).ethereum) {
                setWeb3Error('No Ethereum wallet found. Please install MetaMask or another Web3 wallet.');
            } else {
                setWeb3Error('Failed to sign in with wallet. Please try again.');
            }
        } finally {
            setIsWeb3Loading(false);
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                <CardDescription>
                    Enter your email below to create your account
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <form action={signInWithTwitch}>
                        <Button className="w-full bg-[#9146FF] hover:bg-[#7d2eff] text-white" size="lg">
                            <Twitch className="mr-2 h-4 w-4" />
                            Twitch
                        </Button>
                    </form>
                    <Button
                        className="w-full bg-[#627EEA] hover:bg-[#4a6cd4] text-white"
                        size="lg"
                        onClick={handleWeb3SignIn}
                        disabled={isWeb3Loading}
                    >
                        {isWeb3Loading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Wallet className="mr-2 h-4 w-4" />
                        )}
                        Ethereum
                    </Button>
                </div>
                {web3Error && (
                    <p className="text-sm text-red-500">{web3Error}</p>
                )}
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
