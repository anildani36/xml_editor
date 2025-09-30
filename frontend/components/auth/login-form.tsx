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
import { CardWrapper } from "..//card/card-wrapper";
import { FormError } from "../error/form-error";
import { LoginSchema } from "@/schemas";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormSuccess } from "../error/form-success";
import { handleLogin } from "@/routes/auth";
import { useState } from "react";

export const LoginForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
        setSuccess("");
        setError("");
        try{
            const response = await handleLogin(values);
            setSuccess(response.data);
        } catch (err: any) {
            setError(err.message);
        }
    }
    return (
        <CardWrapper
            headerTitle="🔐 Login"
            headerLabel="Welcome back"
            backButtonLabel="Don't have an account?"
            backButtonHref="/register"
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-4">
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
                        className="w-full"
                    >
                        Login
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}