
import React, {useContext, useEffect, useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import {AppContext} from '../contexts/AppContext';
import {THEME_DARK} from '../utils/constants';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';

const Login = (props) => {
    const {t, i18n} = useTranslation();
    const {
        theme,
        signInWithGoogle,
        signInWithFacebook,
        continueNotSync
    } = useContext(AppContext);
    const isThemeDark = theme === THEME_DARK;
    return (
        <View style={[styles.container, (isThemeDark ? styles.container_dark : {})]}>

            <View style={styles.appInfo}>
                <IonIcon
                    name="create"
                    color={isThemeDark ? "#fff" : "#4e4a6e"}
                    size={100}
                />
                <Text style={[styles.appNameText, (isThemeDark ? styles.appNameText_dark: {})]}>
                    {t('app.name')}
                </Text>
            </View>
            <View style={styles.loginForm}>
                <Text style={[styles.syncWithText, (isThemeDark ? styles.syncWithText_dark : {})]}>
                    {t('login.notSyncWith')}
                </Text>
                <TouchableOpacity style={[styles.btnOffline, (isThemeDark ? styles.btnOffline_dark : {})]} onPress={() => {
                    continueNotSync();
                }}>
                    <IonIcon
                        name="cloud-offline"
                        color={isThemeDark ? "#4e4a6e" : "#fff"}
                        size={30}
                    />
                    <Text style={[styles.btnOfflineText, (isThemeDark ? styles.btnOfflineText_dark : {})]}>
                        {t('login.btnContinue')}
                    </Text>
                </TouchableOpacity>
                <View style={[styles.line, (isThemeDark ? styles.line_dark : {})]}>

                </View>
                <Text style={[styles.syncWithText, (isThemeDark ? styles.syncWithText_dark : {})]}>
                    {t('login.syncWith')}
                </Text>
                <TouchableOpacity style={[styles.btnLogin, (isThemeDark ? styles.btnLogin_dark : {})]} onPress={() => {
                    signInWithGoogle();
                }}>
                    <IonIcon
                        name="logo-google"
                        color={isThemeDark ? "#4e4a6e" : "#fff"}
                        size={30}
                    />
                    <Text style={[styles.btnLoginText, (isThemeDark ? styles.btnLoginText_dark : {})]}>
                        {t('login.btnText')}
                    </Text>
                </TouchableOpacity>
                <Text style={[styles.orText, (isThemeDark ? styles.orText_dark : {})]}>
                    {t('login.or')}
                </Text>
                <TouchableOpacity style={[styles.btnLogin, (isThemeDark ? styles.btnLogin_dark : {})]} onPress={() => {
                    signInWithFacebook();
                }}>
                    <IonIcon
                        name="logo-facebook"
                        color={isThemeDark ? "#4e4a6e" : "#fff"}
                        size={30}
                    />
                    <Text style={[styles.btnLoginText, (isThemeDark ? styles.btnLoginText_dark : {})]}>
                        {t('login.btnText')}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        height: '100%',
        backgroundColor: '#e8ebfc',
        paddingBottom: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container_dark: {
        backgroundColor: '#646187'
    },
    appInfo: {
        marginTop: 10,
        // position: 'absolute',
        // top: 10,
        // alignItems: 'center'
    },
    appNameText: {
        color: '#4e4a6e',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        fontSize: 24
    },
    appNameText_dark: {
        color: '#fff',
    },
    loginForm: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnOffline: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#6c757d',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    btnOffline_dark: {
        backgroundColor: '#d9d9d9',
    },
    btnOfflineText: {
        marginLeft: 5,
        color: '#fff',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    btnOfflineText_dark: {
        color: '#4e4a6e'
    },
    line: {
        height: 1,
        marginHorizontal: 20,
        backgroundColor: '#4e4a6e',
        width: 90,
        marginVertical: 35,
    },
    line_dark: {
        backgroundColor: '#d9d9d9'
    },
    syncWithText: {
        fontSize: 15,
        color: '#8d99ae',
        fontWeight: '500',
        marginBottom: 10,
    },
    syncWithText_dark: {
        color: '#edede9'
    },
    btnLogin: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4e4a6e',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    btnLogin_dark: {
        backgroundColor: '#fff',
    },
    btnLoginText: {
        marginLeft: 5,
        color: '#fff',
        fontWeight: '600',
        textTransform: 'uppercase'
    },
    btnLoginText_dark: {
        color: '#4e4a6e'
    },
    orText: {
        marginVertical: 20,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        color: '#4e4a6e',
    },
    orText_dark: {
        color: '#fff',
    },
});
export default Login;
