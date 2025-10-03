import * as z from "zod";
import api from "../api";
import { LoginSchema, RegisterSchema } from "@/schemas/form_schemas";

export const handleLogin = async (values: z.infer<typeof LoginSchema>) => {
    try {
        const response = await api.post(
            "/v1/auth/login",
            values
        );
        return response.data;
  } catch (err: any) {
    throw err.response?.data || { message: "Login failed" };
  }
};

export const handleLogout = () => {
    console.log("Logout form submit!")
}

export const handleSignup = async (values: z.infer<typeof RegisterSchema>) => {
    try {
        const response = await api.post(
            "/v1/auth/signup",
            values
        );
        return response.data;
  } catch (err: any) {
    throw err.response?.data || { message: "Signup failed" };
  }
};

export const requestAccessToken = () => {
    console.log("Access token request!")
}

export const requestRefreshToken = () => {
    console.log("Refresh token request!")
}