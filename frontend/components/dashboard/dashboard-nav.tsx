"use client";

import { CardWrapper } from "./card/card-wrapper";
import { Button } from "../ui/button";
import Link from "next/link";


export const DashboardNav = () => {
    return (
        <CardWrapper
            headerTitle="Select Editor"
            headerLabel="Select editor to start xml editing"
        >
            <div className="space-y-4">
                <Button
                className="font-normal w-full"
                size="sm"
                >
                    <Link href="/editor/neptune-editor">
                        Neptune Editor
                    </Link>
                </Button>

                <Button
                className="font-normal w-full"
                size="sm"
                >
                    <Link href="/editor/eden-editor">
                        Eden Editor
                    </Link>
                </Button>
            </div>

        </CardWrapper>
    )
}