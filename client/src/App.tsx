import React from 'react';
import ContactsList from './components/Contacts/ContactsList';
import LoginForm from './components/LoginForm/LoginForm';
import Navbar from './components/Navbar/Navbar';
import { useAppSelector } from './hooks/redux';
import "./main.scss";


function App() {
  const { status } = useAppSelector(state => state.userReducer.user.logged);

  return (
    <div className="App">
      <Navbar />

      {status === "logged" ? <ContactsList /> : <LoginForm />}

    </div>
  );
}

export default App;
