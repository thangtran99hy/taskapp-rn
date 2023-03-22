import React, {useContext} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {AppContext} from '../contexts/AppContext';
import {THEME_DARK, THEME_LIGHT} from '../utils/constants';

const IconSwitchTheme = (props) => {
    const {
        theme,
        setTheme,
        loadingTheme
    } = useContext(AppContext);
    if (!loadingTheme) {
        return null;
    }
    return (
        <TouchableOpacity style={[styles.iconSwitchTheme, (theme === THEME_DARK ? styles.iconSwitchTheme_dark : {})]} onPress={() => {
            setTheme(theme === THEME_DARK ? THEME_LIGHT : THEME_DARK)
        }}>
            {
                theme === THEME_DARK ?
                    <IonIcon
                        name="flashlight"
                        size={24}
                        color="#fff"
                    />
                    :
                    <IonIcon
                        name="moon"
                        size={24}
                        color="#4e4a6e"
                    />
            }
        </TouchableOpacity>
    )
}

export default IconSwitchTheme;

const styles = StyleSheet.create({
    iconSwitchTheme: {
        backgroundColor: '#fff',
        position: 'absolute',
        borderRadius: 36,
        padding: 5,
        right: 20,
        bottom: 80,
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99,
        elevation: 99
    },
    iconSwitchTheme_dark: {
        backgroundColor: '#9d9ba7',
    }
})
