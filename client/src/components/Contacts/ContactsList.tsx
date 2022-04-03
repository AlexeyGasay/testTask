import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { getContacts } from '../../store/reducers/AsyncActionCreators';
import "./concatsList.scss";

interface NewContact {
    name: string;
    email: string;
    phone: number;
}


const ContactsList = () => {

    const { token } = useAppSelector(state => state.userReducer.user.logged);
    const { contacts } = useAppSelector(state => state.userReducer);
    const { email } = useAppSelector(state => state.userReducer.user);

    // Флаг того что поля заполнены
    const [fullFields, setFullFields] = useState<boolean>(false);

    // Флаг того что поля заполнены [Popup]
    const [fullFieldsPopup, setfullFieldsPopup] = useState<boolean>(false);


    const [searchStr, setSearchStr] = useState<string>("");

    const [popup, setPopup] = useState<boolean>(false);
    

    const [selectedId, setSelectedId] = useState<number>();
    const [selectedName, setSelectedName] = useState<string>("");
    const [selectedEmail, setSelectedEmail] = useState<string>("");
    const [selectedPhone, setSelectedPhone] = useState<number>(0);

    const [newContact, setNewContact] = useState<NewContact>({
        email: "",
        name: "",
        phone: 0,
    })


    const dispatch = useAppDispatch();


    const edit = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
        e.stopPropagation();
        setPopup(true);

        // Редактируемый элемент
        let selectedContact = contacts.find(i => i.id === id) || contacts[0];

        setSelectedId(selectedContact.id);
        setSelectedName(selectedContact.name)
        setSelectedEmail(selectedContact.email)
        setSelectedPhone(selectedContact.phone)

        console.log(id)
        console.log(selectedContact)

    }

    const newContactHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        switch (e.target.name) {
            case "name": {
                setNewContact({
                    name: e.target.value,
                    email: newContact.email,
                    phone: newContact.phone
                })
                return
            }
            case "email": {
                setNewContact({
                    name: newContact.name,
                    email: e.target.value,
                    phone: newContact.phone
                })
                return
            }
            case "phone": {
                setNewContact({
                    name: newContact.name,
                    email: newContact.email,
                    phone: +e.target.value,
                })
                return
            }
        }
    }

    const hiddenPopup = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setPopup(false);
        checkFieldsPopup();
    }


    const createContact = async () => {
        let body = {
            name: newContact.name,
            email: newContact.email,
            phone: newContact.phone,
            emailIdentity: email
        }

        await fetch(`http://localhost:8000/contacts`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,

            }

        })

        dispatch(getContacts(token, email));
        setNewContact({email: "", phone: 0, name: ""});

    }

    const updateContact = async () => {
        let body = {
            id: selectedId,
            name: selectedName,
            email: selectedEmail,
            phone: selectedPhone
        }

        await fetch(`http://localhost:8000/contacts/${body.id}`, {
            method: "PATCH",
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,

            }
            

        })
        .then(res => alert("Данные изменены"))

        dispatch(getContacts(token, email));

    }

    const deleteContact = async (id: number) => {

        await fetch(`http://localhost:8000/contacts/${id}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,

            }

        })

        dispatch(getContacts(token, email));

    }


    const search = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchStr(e.target.value);
    }

    const checkFields = () => {
        if (
            newContact.email.length >= 4 &&
            newContact.name.length >= 4 &&
            newContact.phone > 0
        ) {
            setFullFields(true)
            
        } else setFullFields(false) 
    }


    const checkFieldsPopup = () => {
        if (
            selectedEmail.length >= 4 &&
            selectedName.length >= 4 &&
            +selectedPhone > 0
        ) {
            setfullFieldsPopup(true)
            
        } else setfullFieldsPopup(false) 
    }
    

    useEffect(() => {
        dispatch(getContacts(token, email));
    }, [])


    return (
        <div className="contacts-list">
            <div className="search">    
                <p>Поиск по полю Name</p>
                <input className="search-input" value={searchStr} onChange={(e) => search(e)} type="text" placeholder='Search...' />

            </div>

            <div>
                <form className="create-contact" action="">
                    
                    {!fullFields && <p>Заполните все поля (мин. по 4 символа в name и email и 1 цифры в номере)</p>}
                    <input maxLength={15} onBlur={() => checkFields()} className="create-contact__input" onChange={(e) => newContactHandler(e)} value={newContact.name} placeholder="Name..." name="name" type="text" />
                    <input maxLength={25} onBlur={() => checkFields()} className="create-contact__input" onChange={(e) => newContactHandler(e)} value={newContact.email} placeholder="Email..." name="email" type="email" />
                    <input maxLength={1} step="-1" onBlur={() => checkFields()} className="create-contact__input" onChange={(e) => newContactHandler(e)} value={newContact.phone} name="phone" type="number" />
                   
                    <button disabled={!fullFields} className="create-btn" onClick={() => createContact()}>Создать</button>
                </form>
            </div>

            {contacts && contacts.map((i) => {
                if (i.name.includes(searchStr)) {
                    return (
                        <div className="contact" key={i.id}>
                            <div className="contact-info">

                                <div>Id: {i.id}</div>
                                <div>Name: {i.name}</div>
                                <div>Email: {i.email}</div>
                                <div>Phone: {i.phone}</div>

                            </div>

                            <div className="contact-edit">


                                <button className="contact-edit__btn edit-btn"
                                    onClick={(e) => edit(e, i.id)}
                                >Редактировать</button>


                                <button className="contact-edit__btn delere-btn"
                                    onClick={() => deleteContact(i.id)}
                                >
                                    Удалить
                                </button>

                            </div>

                        </div>)
                }
            })}




            <div className="edit-popup"
                style={popup ? { visibility: "visible", opacity: 1 } : { visibility: 'hidden' }}
                onClick={(e) => hiddenPopup(e)}
            >
                <div className="edit-container"
                    onClick={(e) => e.stopPropagation()}
                >

                    <p>Измените значения</p>
                    {!fullFieldsPopup && <p>Заполните все поля</p>}
                    <input value={selectedName}
                        className="edit-input change-contact-input"
                        type="text"
                        placeholder="Name..."
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedName(e.target.value)}
                        onBlur={() => checkFieldsPopup()}
                    />
                    <input value={selectedEmail}
                        className="edit-input change-contact-input"
                        type="text"
                        placeholder="Email..."
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedEmail(e.target.value)}
                        onBlur={() => checkFieldsPopup()}
                    />
                    <input value={selectedPhone}
                        className="edit-input change-contact-input"
                        type="number"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedPhone(+e.target.value)}
                        onBlur={() => checkFieldsPopup()}
                    />
                    <button disabled={!fullFieldsPopup} className="create-btn" onClick={() => updateContact()}>Сохранить</button>
                </div>

            </div>
        </div>
    );
};

export default ContactsList;