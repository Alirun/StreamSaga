import { Zap } from "lucide-react";
import Link from "next/link";

export function Logo() {
    return (
        <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Zap className="h-5 w-5 text-primary fill-primary/20" />
            </div>
            <span className="font-bold text-xl tracking-tight">StreamSaga</span>
        </Link>
    );
}
