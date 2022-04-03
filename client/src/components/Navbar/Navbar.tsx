import React, { FC } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { userSlice } from '../../store/reducers/UserSlice';
import "./navbar.scss";



const Navbar: FC = () => {

    const dispatch = useAppDispatch();
    const { status } = useAppSelector(state => state.userReducer.user.logged)
    const { email } = useAppSelector(state => state.userReducer.user)


    if (status) {
        return (
            <div className="header">
                <div>Здравствуйте {email}</div>
                <button className="exit" onClick={() => dispatch(userSlice.actions.setStatus(""))}>ВЫЙТИ</button>
            </div>
        )
    } else {
        return (
            <p className="enter">Выполните вход</p>

        )
    }
};

export default Navbar;