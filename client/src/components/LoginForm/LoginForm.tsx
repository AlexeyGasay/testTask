import React, { FC, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchLog, fetchReg } from '../../store/reducers/AsyncActionCreators';
import { userSlice } from '../../store/reducers/UserSlice';
import "./loginForm.scss";


const LoginForm: FC = () => {


    const {email, password} = useAppSelector(state => state.userReducer.inputs);
    const [fullFields, setFullFields] = useState(false);
    const dispatch = useAppDispatch();


    const emailHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(userSlice.actions.emailChange(e.target.value))
    }
    const passwordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(userSlice.actions.passwordChange(e.target.value))
    }

    const reg = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        dispatch(fetchReg(email, password));
    }
    const log = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        dispatch(fetchLog(email, password));

        dispatch(userSlice.actions.emailChange(""))
        dispatch(userSlice.actions.passwordChange(""))
    }

    const checkField = () => {
        if(email.length > 4 && password.length > 4) {
            setFullFields(true)
        } else setFullFields(false)
    }


    return (
        <div>
            <form action="" className="login-form">
                {!fullFields &&   <p className="login-full-fields">Заполните все поля</p>}
                <input className="login-form__input"
                    value={email}
                    onBlur={() => checkField()}
                    onChange={(e) => emailHandler(e)}
                    type="email" placeholder="email" />

                <input className="login-form__input"
                    value={password}
                    onBlur={() => checkField()}
                    onChange={(e) => passwordHandler(e)}
                    type="text" name="" id="" placeholder="password" />
                <button disabled={!fullFields} className="login-form__btn" onClick={(e) => reg(e)}>РЕГИСТРАЦИЯ</button>
                <button disabled={!fullFields} className="login-form__btn" onClick={(e) => log(e)}>ЛОГИН</button>
            </form>
            
        </div>
    );
};

export default LoginForm;