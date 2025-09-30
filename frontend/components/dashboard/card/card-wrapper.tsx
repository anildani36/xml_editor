"use client";

import { Card, CardContent, CardHeader } from "../../ui/card";
import { Header } from "./card-header";

interface CardWrapperProps {
    children: React.ReactNode;
    headerTitle: string
    headerLabel: string;
}

export const CardWrapper = ({
    children,
    headerTitle,
    headerLabel
}: CardWrapperProps) => {
    return(
        <Card className="w-[400px] shadow-md">
            <CardHeader>
                <Header title={headerTitle} label={headerLabel}/>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    );
}