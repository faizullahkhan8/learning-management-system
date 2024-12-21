import { apiSlice } from "../api/apiSlice";

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // TODO: update avatar logic going here

        updateUserInfo: builder.mutation({
            query: ({ name }) => ({
                url: "user/update/user/info",
                method: "PUT",
                body: { name },
                credentials: "include" as const,
            }),
        }),
    }),
});

export const { useUpdateUserInfoMutation } = userApi;
