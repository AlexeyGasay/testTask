import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from './../../models/IUser';
import { Contacts } from './AsyncActionCreators';
interface UserState {
    inputs: {
        email: string;
        password: string;
    }
    user: IUser,
    contacts: Contacts[];
}

const initalState: UserState = {
    inputs: {
        email: "",
        password: ""
    },

    user: {
        email: "",
        password: "",
        logged: {
            status: "",
            token: ""
        },
    },
    contacts: []
}

export const userSlice = createSlice({
    name: "user",
    initialState: initalState,
    reducers: {
        emailChange(state, action: PayloadAction<string>) {
            state.inputs.email = action.payload;
        },
        passwordChange(state, action: PayloadAction<string>) {
            state.inputs.password = action.payload;

        },

        setUser(state, action: PayloadAction<IUser>) {
            state.user.email = action.payload.email;
            state.user.password = action.payload.password;
            state.user.logged = action.payload.logged;
        },

        setContacts(state, action: PayloadAction<Contacts[]>) {
            state.contacts = action.payload;
        },

        setStatus(state, action: PayloadAction<string>) {
            state.user.logged.status = action.payload;
        }

        

    }
})

export default userSlice.reducer;