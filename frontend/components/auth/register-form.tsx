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
import { RegisterSchema } from "@/schemas/form_schemas";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormSuccess } from "../error/form-success";
import { useState } from "react";
import { handleSignup } from "@/routes/auth";

export const RegisterForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: ""
        },
    })

    const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
        setSuccess("");
        setError("");
        try{
            const response = await handleSignup(values);
            setSuccess(response.data);
        } catch (err: any) {
            setError(err.message);
        }
    }

    return (
        <CardWrapper
            headerTitle="📝 Register"
            headerLabel="Create an account"
            backButtonLabel="Already have an account?"
            backButtonHref="/login"
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-4">
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
                                            />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                        )}/>

                        <FormField 
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            placeholder="******"
                                            type="password"
                                            />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                        )}/>
                    </div>

                    <FormError message={error} />
                    <FormSuccess message={success} />

                    <Button
                        type="submit"
                        className="w-full cursor-pointer"
                    >
                        Signup
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}