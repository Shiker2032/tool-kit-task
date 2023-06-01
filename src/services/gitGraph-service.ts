import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react"

interface IUser {
    login:string
}

interface IGetUser {

        data: {
            viewer: {
                login:string
            }
        }
    
}

const token = import.meta.env.VITE_TOKEN;

export const gitGraphApi = createApi({
    reducerPath: "gitGraphAPi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://api.github.com/graphql",
    }),
    endpoints: (builder) => ({
        fetchUser: builder.query<IGetUser, string|void>({
            query: (query:string) => ({
                method: "POST",
                headers: {
                    Authorization: `bearer ${token}`,
                },
                url: "",
                body: JSON.stringify({query})                
            })
        })
    })
})