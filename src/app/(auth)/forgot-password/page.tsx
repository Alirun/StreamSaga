import type { Metadata } from "next";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = {
    title: "Forgot Password | StreamSaga",
    description: "Reset your StreamSaga account password.",
};

export default function ForgotPasswordPage() {
    return <ForgotPasswordForm />;
}
