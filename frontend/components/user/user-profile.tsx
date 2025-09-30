"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { CardWrapper } from "../card/card-wrapper";
import { FormError } from "../error/form-error";
import { UserProfileSchema } from "@/schemas";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormSuccess } from "../error/form-success";
import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchUserData } from "@/routes/user";

export const UserProfile = () => {
    const [isDisabled, setIsDisabled] = useState(true);
    const form = useForm<z.infer<typeof UserProfileSchema>>({
        resolver: zodResolver(UserProfileSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            userName: "",
            email: "",
            
        },
    })

    const onSubmit = (values: z.infer<typeof UserProfileSchema>) => {
        console.log("Values", values);
    }

    useEffect(() => {
        
        const fetchUserData = async () => {
            // try {
            //     const response = await api.get("v1/users/profile/anild")
            //     form.reset({
            //         firstName: response.data?.first_name,
            //         lastName: response.data?.lasst_name,
            //         userName: response.data?.username,
            //         email: response.data?.email_id
            //     });
            // } catch(error) {
            //     console.error("err", error)
            // }
            
        }

        const userData = fetchUserData();
        // form.reset({...userData});
    }, [])

    return (
        <CardWrapper
            headerTitle="User Profile"
            headerLabel="Manage your account"
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-4">
                        <FormField 
                            control={form.control}
                            name="userName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            placeholder="John"
                                            type=""
                                            disabled
                                            />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                        )}/>
                        <FormField 
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            placeholder="John"
                                            type=""
                                            disabled={isDisabled}
                                            />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                        )}/>

                        <FormField 
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            placeholder="Doe"
                                            type=""
                                            disabled={isDisabled}
                                            />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                        )}/>

                        <FormField 
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            placeholder="john.doe@example.com"
                                            type="email"
                                            disabled={isDisabled}
                                            />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                        )}/>

                    </div>

                    {/* <FormError message="Registration failed!" />
                    <FormSuccess message="Registration sucess" /> */}

                    <Button
                        className="font-normal w-full"
                        size="sm"
                        >
                        <Link href="/home/dashboard">
                            Go to Dashboard
                        </Link>
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}