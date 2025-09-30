"use client";

import { Button } from "../ui/button";
import Link from "next/link";

interface FooterProps {
    label: string;
    href: string
}

export const Footer = ({
    label,
    href
}: FooterProps) => {
    return (
        <Button
            variant="link"
            className="font-normal w-full"
            size="sm"
            asChild
        >
            <Link href={href}>
                {label}
            </Link>
        </Button>
    );
}