import type { Metadata } from "next";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = {
    title: "Reset Password | StreamSaga",
    description: "Set a new password for your StreamSaga account.",
};

export default function ResetPasswordPage() {
    return <ResetPasswordForm />;
}
