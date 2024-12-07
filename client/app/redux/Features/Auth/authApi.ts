/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import toast from "react-hot-toast";
import { apiSlice } from "../api/apiSlice";

import { userRegisteration, userLoggedIn } from "./authSlice";

interface RegisterationResponse {
    message: string;
    activationToken: string;
}

interface RegisterationData {}

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // endpoints here
        register: builder.mutation<RegisterationResponse, RegisterationData>({
            query: (data) => ({
                url: "user/registration",
                method: "POST",
                body: data,
                credentials: "include" as const,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                await queryFulfilled
                    .then((result) =>
                        dispatch(
                            userRegisteration({
                                token: result.data.activationToken,
                            })
                        )
                    )
                    .catch((error) => console.log(error));
            },
        }),
        activation: builder.mutation({
            query: ({ activation_code }) => ({
                url: "user/registration/activate",
                method: "POST",
                body: { activation_code },
                credentials: "include" as const,
            }),
        }),
        login: builder.mutation({
            query: ({ email, password }) => ({
                url: "user/login",
                method: "POST",
                body: { email, password },
                credentials: "include" as const,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                await queryFulfilled
                    .then((response) => {
                        dispatch(
                            userLoggedIn({
                                user: response.data.user,
                                token: response.data.token,
                            })
                        );
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
        }),
    }),
});

export const { useRegisterMutation, useActivationMutation, useLoginMutation } =
    authApi;
