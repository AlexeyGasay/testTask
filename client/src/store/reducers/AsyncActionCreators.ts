import { userSlice } from './UserSlice';
import { AppDispatch } from "../store";
import axios from "axios";


export interface Contacts {
    id: number;
    name: string;
    email: string;
    phone: number;
}



export const getContacts = (token: string, emailIdentity: string | null) => async (dispatch: AppDispatch) => {
    const res = await axios.get<Contacts[]>(`http://localhost:8000/contacts?emailIdentity=${emailIdentity}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,

        }
    })

    dispatch(userSlice.actions.setContacts(res.data))
}



export const fetchReg = (email: string, password: string) => async (dispatch: AppDispatch) => {
    let body = {
        password: password,
        email: email
    }

    if (email.length == 0 || password.length == 0) {
       return alert("Заполните формы")
    }

    try {
        await fetch("http://localhost:8000/auth/register", {
            method: "post",
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            }
        })

            .then(res => res.json())
            .then(data => {
                if(data.access_token) {
                    alert("Зарегистрирован")
                } else alert(data.message)

            })


    } catch (e) {
        alert(e)
    }

}
export const fetchLog = (email: string, password: string) => async (dispatch: AppDispatch) => {
    let body = {
        password: password,
        email: email
    }

    if (email.length == 0 || password.length == 0) {
        alert("Заполните формы")
    }

    try {
        await fetch("http://localhost:8000/auth/login", {
            method: "post",
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        })

            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.access_token) {
                    dispatch(userSlice.actions.setUser({
                        email, password, logged: {
                            status: "logged",
                            token: data.access_token
                        }
                    }))
                } else {
                    alert("Неверный логин или пароль")
                }
            })


    } catch (e) {
        alert(e)
    }

}

