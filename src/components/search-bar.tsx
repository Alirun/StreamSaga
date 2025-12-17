"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchBarProps {
    className?: string;
}

export function SearchBar({ className }: SearchBarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("q") || "";

    const [isExpanded, setIsExpanded] = useState(!!initialQuery);
    const [searchValue, setSearchValue] = useState(initialQuery);
    const inputRef = useRef<HTMLInputElement>(null);

    // Sync state if URL changes externally
    useEffect(() => {
        setSearchValue(initialQuery);
        if (initialQuery) setIsExpanded(true);
    }, [initialQuery]);

    // Focus input when expanded
    useEffect(() => {
        if (isExpanded && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isExpanded]);

    const handleSearch = () => {
        if (searchValue.trim()) {
            router.push(`/?q=${encodeURIComponent(searchValue.trim())}`);
        } else {
            router.push("/");
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        } else if (e.key === "Escape") {
            setIsExpanded(false);
            if (!initialQuery) setSearchValue("");
        }
    };

    const handleClear = () => {
        setSearchValue("");
        router.push("/");
        if (!className?.includes("md:flex")) { // Heuristic check if mobile view context
            setIsExpanded(false);
        }
    };

    const handleToggle = () => {
        if (isExpanded) {
            handleClear();
            setIsExpanded(false);
        } else {
            setIsExpanded(true);
        }
    };

    return (
        <div className={cn("relative flex items-center", className)}>
            {/* Desktop search - always visible */}
            <div className="hidden md:flex items-center relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-muted-foreground" />
                </div>
                <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search topics..."
                    className="h-9 w-64 rounded-full border border-input bg-background/50 pl-9 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all"
                />
                {searchValue && (
                    <button
                        onClick={handleClear}
                        className="absolute right-3 text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Mobile search - expandable */}
            <div className="md:hidden flex items-center">
                {isExpanded ? (
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <input
                                ref={inputRef}
                                type="text"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Search..."
                                className="h-9 w-40 rounded-full border border-input bg-background/50 pl-9 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            />
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 shrink-0"
                            onClick={handleToggle}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9"
                        onClick={handleToggle}
                    >
                        <Search className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
