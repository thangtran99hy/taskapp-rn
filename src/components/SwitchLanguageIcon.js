import React, {useContext} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {AppContext} from '../contexts/AppContext';
import {LANGUAGE_EN, LANGUAGE_VI, THEME_DARK, THEME_LIGHT} from '../utils/constants';

const SwitchLanguageIcon = (props) => {
    const {
        theme,
        language,
        setLanguage,
        loadingLanguage
    } = useContext(AppContext);
    if (!loadingLanguage) {
        return null;
    }
    return (
        <TouchableOpacity style={[styles.iconSwitchTheme, (theme === THEME_DARK ? styles.iconSwitchTheme_dark : {})]} onPress={() => {
            setLanguage(language === LANGUAGE_EN ? LANGUAGE_VI : LANGUAGE_EN)
        }}>
            {
                language === LANGUAGE_EN ?
                    <Image
                        source={require('../assets/images/vi.png')}
                        style={styles.imageFlag}
                    />
                    :
                    <Image
                        source={require('../assets/images/en.png')}
                        style={styles.imageFlag}
                    />
            }
        </TouchableOpacity>
    )
}

export default SwitchLanguageIcon;

const styles = StyleSheet.create({
    iconSwitchTheme: {
        backgroundColor: '#fff',
        position: 'absolute',
        borderRadius: 36,
        padding: 5,
        left: 20,
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
    },
    imageFlag: {
        width: 24,
        height: 24,
    }
})
