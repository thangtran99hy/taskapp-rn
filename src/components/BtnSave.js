import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import React, {useContext} from 'react';
import {THEME_DARK} from '../utils/constants';
import {AppContext} from '../contexts/AppContext';

const BtnSave = (props) => {
    const {
        theme,
    } = useContext(AppContext);
    const {
        onPress,
        text,
        style
    } = props;
    const isThemeDark = theme === THEME_DARK;
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.btnSave, (isThemeDark ? styles.btnSave_dark : {}), style]}
        >
            <IonIcon
                name="save"
                color={isThemeDark ? '#46435a' : '#fff'}
                size={18}
            />
            <Text
                style={[styles.textSave, (isThemeDark ? styles.textSave_dark : {})]}
            >
                {text}
            </Text>
        </TouchableOpacity>
    )
}

export default BtnSave;

const styles = StyleSheet.create({
    btnSave: {
        backgroundColor: '#5d4bae',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 5,
    },
    btnSave_dark: {
        backgroundColor: '#f3b307',
    },
    textSave: {
        color: '#fff',
        marginLeft: 10,
        fontWeight: 'bold'
    },
    textSave_dark: {
        color: '#46435a'
    }
})
