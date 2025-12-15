import type { Metadata } from "next";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = {
    title: "Sign Up | StreamSaga",
    description: "Create your StreamSaga account.",
};

export default function SignupPage() {
    return <SignupForm />;
}
