import { fetchBaseQuery } from "@reduxjs/toolkit/query";



export const getFetchBaseQuery = (url) => {
    return fetchBaseQuery({
        baseUrl: url,
        prepareHeaders: (headers, {getState}) =>{
            const token = sessionStorage.getItem("jwt")

            if(token){
                headers.set("Authorization", `Bearer ${token}`)
            }
            return headers;
        }   
    })
}


