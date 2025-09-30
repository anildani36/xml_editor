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
import { RegisterSchema } from "@/schemas";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormSuccess } from "../error/form-success";

export const RegisterForm = () => {
    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: ""
        },
    })

    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        console.log("Values", values);
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

                    <FormError message="Registration failed!" />
                    <FormSuccess message="Registration sucess" />

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