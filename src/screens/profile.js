import React, {useContext, useEffect, useState} from 'react';
import {
    StyleSheet,
    Button,
    Text,
    View,
    TextInput,
    FlatList,
    TouchableOpacity,
    ScrollView,
    Image,
    Alert, TouchableHighlight,
} from 'react-native';
import {AppContext} from '../contexts/AppContext';
import {THEME_DARK, USER_TYPE_FACEBOOK, USER_TYPE_GOOGLE, USER_TYPE_LOCAL} from '../utils/constants';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useTranslation} from 'react-i18next';
import AsyncData from '../components/AsyncData';

const Profile = (props) => {
    const {t} = useTranslation();
    const {
        navigation
    } = props;
    const {
        theme,
        user,
        signOutWithGoogle,
        signOutWithFacebook,
        viewAsyncData,
        signInWithGoogleToSync,
        signInWithFacebookToSync,
        deleteDataNotSync
    } = useContext(AppContext);
    const isThemeDark = theme === THEME_DARK;
    const photo = user?.photo;
    const email = user?.email;
    const firstName = user?.firstName;
    const lastName = user?.lastName;
    const fullName = user?.fullName;
    const userType = user?.userType;


    const displayOnSignOutAlert = () => {
        Alert.alert(t('label.sure'), t('profile.message_sign_out'), [
            {
                text: t('label.yes'),
                onPress: () => {
                    onSignOut();
                }
            },
            {
                text: t('label.noThanks'),
                onPress: () => {

                }
            },
        ], {
            cancelable: true
        })
    }
    const onSignOut = () => {
        if (userType === USER_TYPE_FACEBOOK) {
            signOutWithFacebook();
        } else {
            signOutWithGoogle();
        }
    }

    const displayDeleteDataAlert = () => {
        Alert.alert(t('label.sure'), t('profile.message_delete'), [
            {
                text: t('label.yes'),
                onPress: () => {
                    deleteDataNotSync();
                }
            },
            {
                text: t('label.noThanks'),
                onPress: () => {

                }
            },
        ], {
            cancelable: true
        })
    }

    if (userType === USER_TYPE_LOCAL) {
        return (
            <View style={[styles.container, (isThemeDark ? styles.container_dark : {})]}>
                <Text style={[styles.usingOfflineText, (isThemeDark ? styles.usingOfflineText_dark : {})]}>
                    {t('profile.offlineText')}
                </Text>
                <TouchableOpacity style={[styles.btnDeleteData, (isThemeDark ? styles.btnDeleteData_dark : {})]} onPress={() => {
                    displayDeleteDataAlert();
                }}>
                    <IonIcon
                        name="trash"
                        color={isThemeDark ? "#4e4a6e" : "#fff"}
                        size={30}
                    />
                    <Text style={[styles.deleteDataText, (isThemeDark ? styles.deleteDataText_dark : {})]}>
                        {t('profile.deleteData')}
                    </Text>
                </TouchableOpacity>
                <View style={[styles.line, (isThemeDark ? styles.line_dark : {})]}>

                </View>
                <Text style={[styles.usingOfflineText, (isThemeDark ? styles.usingOfflineText_dark : {})]}>
                    {t('profile.syncDataWith')}
                </Text>
                <TouchableOpacity style={[styles.btnLogin, (isThemeDark ? styles.btnLogin_dark : {})]} onPress={() => {
                    signInWithGoogleToSync();
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
                    signInWithFacebookToSync();
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
        )
    }
    return (
        <>
            <View style={[styles.container, (isThemeDark ? styles.container_dark : {})]}>
                <View style={styles.avatarWrapper}>
                    {photo ? <Image
                        source={{
                            uri: photo
                        }}
                        style={styles.avatarImage}
                    /> : <TouchableHighlight style={[styles.avatarTextWrapper, (isThemeDark ? styles.avatarTextWrapper_dark : {})]}>
                        <Text style={[styles.avatarText, (isThemeDark ? styles.avatarText_dark : {})]}>
                            {firstName ? firstName[0] : ""} {lastName ? lastName[0] : ""}
                        </Text>
                    </TouchableHighlight>}
                </View>
                {email ? <Text style={[styles.emailText, (isThemeDark ? styles.emailText_dark : {})]}>
                    {email}
                </Text> : null}
                {fullName ? <Text style={[styles.fullNameText, (isThemeDark ? styles.fullNameText_dark : {})]}>
                    {fullName}
                </Text> : null}
                <TouchableOpacity style={[styles.signOutIcon, (theme === THEME_DARK ? styles.signOutIcon_dark : {})]} onPress={() => {
                    displayOnSignOutAlert()
                }}>
                    <IonIcon
                        name="log-out"
                        size={36}
                        color={isThemeDark ? "#fff" : "#646187"}
                    />
                </TouchableOpacity>
            </View>
        </>
    )
}

export default Profile;

const styles = StyleSheet.create({
    container: {
        padding: 10,
        height: '100%',
        backgroundColor: '#e8ebfc',
        paddingBottom: 80,
        alignItems: 'center',
        paddingTop: 50,
    },
    container_dark: {
        backgroundColor: '#646187'
    },
    avatarWrapper: {
        paddingBottom: 20,
    },
    avatarImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    avatarTextWrapper: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#a5a4b1'
    },
    avatarTextWrapper_dark: {
        backgroundColor: '#4e4a6e',
    },
    avatarText: {
        color: '#fff',
        fontSize: 36,
        fontWeight: 'bold'
    },
    avatarText_dark: {
        color: '#fff'
    },
    emailText: {
        color: '#5a5a5a',
        fontSize: 14,
    },
    emailText_dark: {
        color: "#fff"
    },
    fullNameText: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#646187',
        marginBottom: 10,
    },
    fullNameText_dark: {
        color: '#fff'
    },
    signOutIcon: {
        marginTop: 20,
    },
    signOutIcon_dark: {},
    usingOfflineText: {
        fontSize: 15,
        color: '#8d99ae',
        fontWeight: '500',
        marginBottom: 10,
    },
    usingOfflineText_dark: {
        color: '#edede9'
    },
    btnDeleteData: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4e4a6e',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    btnDeleteData_dark: {
        backgroundColor: '#fff',
    },
    deleteDataText: {
        marginLeft: 5,
        color: '#fff',
        fontWeight: '600',
        textTransform: 'uppercase'
    },
    deleteDataText_dark: {
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
})
