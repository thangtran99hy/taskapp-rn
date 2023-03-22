import React from 'react';
import {StyleSheet, TextInput} from 'react-native';
import {AppContext} from '../contexts/AppContext';
import {useContext} from 'react';
import {THEME_DARK} from '../utils/constants';

const Input = (props) => {
    const {
        theme,
        setTheme
    } = useContext(AppContext);
    const {
        value,
        onChangeText,
        style,
        placeholder,
        multiline,
        keyboardType
    } = props;
    const isThemeDark = theme === THEME_DARK;

    return (
        <TextInput
            value={value}
            onChangeText={onChangeText}
            style={[styles.input, (isThemeDark ? styles.input_dark : {}), style]}
            placeholder={placeholder}
            multiline={multiline}
            keyboardType={keyboardType}
        />
    )
}

export default Input;

const styles = StyleSheet.create({
    input: {
        backgroundColor: '#fff',
        color: '#3a3a3a',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 5,
    },
    input_dark: {
        backgroundColor: '#7a789a',
        color: '#fff',
    },
})
