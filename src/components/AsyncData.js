import React, {useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import {AppContext} from '../contexts/AppContext';
const AsyncData = (props) => {
    const {
        asyncSchedule
    } = useContext(AppContext);
    useEffect(() => {
        asyncSchedule();
    }, [])
    return null;
}

export default AsyncData;
