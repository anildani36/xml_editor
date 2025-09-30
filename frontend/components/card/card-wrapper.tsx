"use client";

import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Footer } from "./card-footer";
import { Header } from "./card-header";

interface CardWrapperProps {
    children: React.ReactNode;
    headerTitle: string;
    headerLabel: string;
    backButtonLabel?: string;
    backButtonHref?: string;
}

export const CardWrapper = ({
    children,
    headerTitle,
    headerLabel,
    backButtonLabel,
    backButtonHref
}: CardWrapperProps) => {
    return(
        <Card className="w-[400px] shadow-md">
            <CardHeader>
                <Header title={headerTitle} label={headerLabel}/>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            { backButtonLabel && backButtonHref ? (
                <CardFooter>
                    <Footer 
                        label={backButtonLabel}
                        href={backButtonHref}
                    />
                </CardFooter>
            ) : (
                <></>
            )}
            
        </Card>
    );
}