import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    username: "USERNAME",
    password : "",
    email: ""
}

export const userSlice = createSlice({
    name: "contador",
    initialState,
    reducers: {
        keepUserInfo: (state) =>{
            console.log("PAYLOAD : ",state.user);
            state.username = "new user name"
            },
    }
})

export const getUserInfo = (state) => {return state.user}
export const { keepUserInfo } = userSlice.actions
export default userSlice.reducer;