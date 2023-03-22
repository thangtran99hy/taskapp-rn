import React, {useContext, useEffect} from 'react';
import {AppContext} from '../contexts/AppContext';
const UserData = (props) => {
    const {
        checkLoginData,
    } = useContext(AppContext);
    useEffect(() => {
        checkLoginData();
    }, [])

    return null;
}

export default UserData;
