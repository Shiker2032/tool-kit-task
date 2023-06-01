// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { useAppDispatch } from "../app/hooks";



// interface IUserState {
//     login: string;
// };

// const initialState:IUserState = {
//     login: ""
// }

// const userSlice = createSlice ({
//     name:"user",
//     initialState: initialState,
//     reducers: {
//         updateUser(state, action: PayloadAction<string>) {
//             state.login = action.payload;
//         },
//         resetUser(state) {
//             state.login = initialState.login;
//         }        
//     }
// })

// export const {updateUser, resetUser} = userSlice.actions;
// export default userSlice.reducer;