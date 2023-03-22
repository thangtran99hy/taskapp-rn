import React from 'react';
import {createContext, useEffect, useState} from 'react';
import {
    DATABASE_DAILY,
    DATABASE_GROUP, DATABASE_NOTE, DATABASE_TASK,
    FIREBASE_ROOT_DAILY,
    FIREBASE_ROOT_GROUP, FIREBASE_ROOT_LOGIN, FIREBASE_ROOT_NOTE, FIREBASE_ROOT_TASK, GOOGLE_CLIENT_ID,
    KEY_STORAGE_LANGUAGE,
    KEY_STORAGE_LAST_CHANGE_DB_DAILY,
    KEY_STORAGE_LAST_CHANGE_DB_GROUP, KEY_STORAGE_LAST_CHANGE_DB_NOTE,
    KEY_STORAGE_LAST_CHANGE_DB_TASK, KEY_STORAGE_LAST_SYNC_DATE,
    KEY_STORAGE_THEME, KEY_STORAGE_USER,
    LANGUAGE_EN,
    listLanguage,
    listTheme,
    THEME_LIGHT, TIME_SYNC_MIN,
    USER_TYPE_FACEBOOK,
    USER_TYPE_GOOGLE, USER_TYPE_LOCAL,
} from '../utils/constants';
import SQLite from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'moment/locale/es';
import 'moment/locale/vi';
import moment from 'moment';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import * as RNLocalize from "react-native-localize";
import firebaseConfig from './../../firebase/config';
import { initializeApp } from 'firebase/app'; //validate yourself
import { getStorage, ref, uploadBytes, uploadString, getDownloadURL } from "firebase/storage";
import axios from 'axios';
import i18n from '../languages/i18n';
import {AccessToken, LoginManager} from 'react-native-fbsdk-next';
import {Platform, ToastAndroid} from 'react-native';
import {useTranslation} from 'react-i18next';
import {getCurrentTime} from '../utils/functions';
import NetInfo from "@react-native-community/netinfo";

initializeApp(firebaseConfig);

const dbGroup = SQLite.openDatabase({
    name: DATABASE_GROUP,
});
const dbTask = SQLite.openDatabase({
    name: DATABASE_TASK,
});
const dbDaily = SQLite.openDatabase({
    name: DATABASE_DAILY
})
const dbNote = SQLite.openDatabase({
    name: DATABASE_NOTE
})
export const AppContext = createContext({})

const AppContextProvider = ({children}) => {
    const {t} = useTranslation();
    const [isConnected, setIsConnected] = useState(true);
    const [loadingDataDaily, setLoadingDataDaily] = useState(false)
    const [viewAsyncData, setViewAsyncData] = useState(false);
    const [loadingAsync, setLoadingAsync] = useState(false);
    const [theme, setTheme] = useState(THEME_LIGHT);
    const [loadingTheme, setLoadingTheme] = useState(false);
    const [language, setLanguage] = useState(listLanguage.includes(RNLocalize.getLocales()[0].languageCode) ? RNLocalize.getLocales()[0].languageCode : LANGUAGE_EN)
    const [loadingLanguage, setLoadingLanguage] = useState(false);
    const [user, setUser] = useState(null);
    const [loadingUser, serLoadingUser] = useState(false);
    const [lastSyncDate, setLastSyncDate] = useState(0);
    const [lastChangeDBGroup, setLastChangeDBGroup] = useState(0);
    const [lastChangeDBTask, setLastChangeDBTask] = useState(0);
    const [lastChangeDBDaily, setLastChangeDBDaily] = useState(0);
    const [lastChangeDBNote, setLastChangeDBNote] = useState(0);
    const [dailyDate, setDailyDate] = useState(moment());
    const [viewImageModal, setViewImageModal] = useState(null);
    const [groups, setGroups] = useState([]);
    const [groupSelected, setGroupSelected] = useState(null);
    const [tasks, setTasks] = useState([]);
    const isSync = [USER_TYPE_GOOGLE, USER_TYPE_FACEBOOK].includes(user?.userType);
    useEffect(() => {
        createTableDBGroup();
        createTableTask();
        createTableDaily();
        createTableNote();
        getGroups();
        getTasks();
    }, []);

    useEffect(() => {
        NetInfo.addEventListener(async state => {
            setIsConnected(state.isConnected);
        })
    }, [])


    /*SYNC DATA STORAGE*/
    useEffect(() => {
        getFromStorage();
    }, [])
    const getFromStorage = async () => {
        getThemeFromStorage();
        getLanguageFromStorage();
        getUserFromStorage();
        getLastSyncDateFromStorage();
        getLastChangeDBGroupFromStorage();
        getLastChangeDBTaskFromStorage();
        getLastChangeDBDailyFromStorage();
        getLastChangeDBNoteFromStorage();
    }
    const getThemeFromStorage = async () => {
        try {
            const result = await AsyncStorage.getItem(KEY_STORAGE_THEME);
            if (listTheme.includes(result)) {
                setTheme(result);
            }
            setLoadingTheme(true);
        } catch (e) {
            setLoadingTheme(true);
        }
    }
    const getLanguageFromStorage = async () => {
        try {
            const result = await AsyncStorage.getItem(KEY_STORAGE_LANGUAGE);
            if (listLanguage.includes(result)) {
                if (i18n.language !== result) {
                    await i18n.changeLanguage(result);
                }
                setLanguage(result);
            }
            setLoadingLanguage(true);
        } catch (e) {
            setLoadingLanguage(true);
        }
    }
    const getUserFromStorage = async () => {
        try {
            const result = await AsyncStorage.getItem(KEY_STORAGE_USER);
            if (result) {
                setUser(JSON.parse(result))
            }
            serLoadingUser(true);
        } catch (e) {
            serLoadingUser(true);
        }
    }
    const getLastSyncDateFromStorage = async () => {
        try {
            const result = await AsyncStorage.getItem(KEY_STORAGE_LAST_SYNC_DATE);
            setLastSyncDate(Number(result));
        } catch (e) {

        }
    }
    const getLastChangeDBGroupFromStorage = async () => {
        try {
            const result = await AsyncStorage.getItem(KEY_STORAGE_LAST_CHANGE_DB_GROUP);
            setLastChangeDBGroup(Number(result));
        } catch (e) {

        }
    }
    const getLastChangeDBTaskFromStorage = async () => {
        try {
            const result = await AsyncStorage.getItem(KEY_STORAGE_LAST_CHANGE_DB_TASK);
            setLastChangeDBTask(Number(result));
        } catch (e) {

        }
    }
    const getLastChangeDBDailyFromStorage = async () => {
        try {
            const result = await AsyncStorage.getItem(KEY_STORAGE_LAST_CHANGE_DB_DAILY);
            setLastChangeDBDaily(Number(result));
        } catch (e) {

        }
    }
    const getLastChangeDBNoteFromStorage = async () => {
        try {
            const result = await AsyncStorage.getItem(KEY_STORAGE_LAST_CHANGE_DB_NOTE);
            setLastChangeDBNote(Number(result));
        } catch (e) {

        }
    }
    useEffect(() => {
        saveThemeToStorage(theme);
    }, [theme])
    useEffect(() => {
        i18n.changeLanguage(language);
        moment.locale(language)
        saveLanguageToStorage(language);
    }, [language])
    useEffect(() => {
        saveUserToStorage(user);
    }, [user])
    useEffect(() => {
        saveLastSyncDateToStorage(lastSyncDate)
    }, [lastSyncDate])
    useEffect(() => {
        saveLastChangeDBGroupToStorage(lastChangeDBGroup)
    }, [lastChangeDBGroup])
    useEffect(() => {
        saveLastChangeDBTaskToStorage(lastChangeDBTask)
    }, [lastChangeDBTask])
    useEffect(() => {
        saveLastChangeDBDailyToStorage(lastChangeDBDaily)
    }, [lastChangeDBDaily])
    useEffect(() => {
        saveLastChangeDBNoteToStorage(lastChangeDBNote)
    }, [lastChangeDBNote])
    const saveThemeToStorage = async (theme) => {
        await AsyncStorage.setItem(KEY_STORAGE_THEME, theme);
    }
    const saveLanguageToStorage = async (language) => {
        await AsyncStorage.setItem(KEY_STORAGE_LANGUAGE, language);
    }
    const saveUserToStorage = async (user) => {
        if (user) {
            await AsyncStorage.setItem(KEY_STORAGE_USER, JSON.stringify(user));
        } else {
            await AsyncStorage.removeItem(KEY_STORAGE_USER);
        }
    }
    const saveLastSyncDateToStorage = async (lastSyncDate) => {
        if (lastSyncDate) {
            await AsyncStorage.setItem(KEY_STORAGE_LAST_SYNC_DATE, lastSyncDate.toString());
        } else {
            await AsyncStorage.removeItem(KEY_STORAGE_LAST_SYNC_DATE);
        }
    }
    const saveLastChangeDBGroupToStorage = async (lastChangeDBGroup) => {
        if (lastChangeDBGroup) {
            await AsyncStorage.setItem(KEY_STORAGE_LAST_CHANGE_DB_GROUP, lastChangeDBGroup.toString());
        } else {
            await AsyncStorage.removeItem(KEY_STORAGE_LAST_CHANGE_DB_GROUP);
        }
    }
    const saveLastChangeDBTaskToStorage = async (lastChangeDBTask) => {
        if (lastChangeDBTask) {
            await AsyncStorage.setItem(KEY_STORAGE_LAST_CHANGE_DB_TASK, lastChangeDBTask.toString());
        } else {
            await AsyncStorage.removeItem(KEY_STORAGE_LAST_CHANGE_DB_TASK);
        }
    }
    const saveLastChangeDBDailyToStorage = async (lastChangeDBDaily) => {
        if (lastChangeDBDaily) {
            await AsyncStorage.setItem(KEY_STORAGE_LAST_CHANGE_DB_DAILY, lastChangeDBDaily.toString());
        } else {
            await AsyncStorage.removeItem(KEY_STORAGE_LAST_CHANGE_DB_DAILY);
        }
    }
    const saveLastChangeDBNoteToStorage = async (lastChangeDBNote) => {
        if (lastChangeDBNote) {
            await AsyncStorage.setItem(KEY_STORAGE_LAST_CHANGE_DB_NOTE, lastChangeDBNote.toString());
        } else {
            await AsyncStorage.removeItem(KEY_STORAGE_LAST_CHANGE_DB_NOTE);
        }
    }
    /*SYNC DATA STORAGE*/

    /*INITIAL DATA AFTER LOGIN*/
    const getInitialDataAfterLogin = async (user) => {
        setLoadingAsync(true);
        await syncDataGroupFromServer(user);
        await syncDataTaskFromServer(user);
        await syncDataDailyFromServer(user);
        setLoadingAsync(false);
    }
    const syncDataGroupFromServer = async (user) => {
        if (user && isConnected) {
            try {
                const userId = user.userType + "_" + user.id;
                const storage = getStorage();
                const starsRef = ref(storage, `${FIREBASE_ROOT_GROUP}/${userId}.json`);
                await getDownloadURL(starsRef)
                    .then((url) => {
                        axios.get(url)
                            .then(res => {
                                if (Array.isArray(res.data)) {
                                    res.data.forEach((item, index) => {
                                        updateOrAddRecordGroup(item, res.data.length - 1 === index);
                                    })
                                }
                            })
                    })
            } catch (e) {

            }
        }
    }
    const syncDataTaskFromServer = async (user) => {
        if (user && isConnected) {
            try {
                const userId = user.userType + "_" + user.id;
                const storage = getStorage();
                const starsRef = ref(storage, `${FIREBASE_ROOT_TASK}/${userId}.json`);
                await getDownloadURL(starsRef)
                    .then((url) => {
                        axios.get(url)
                            .then(res => {
                                if (Array.isArray(res.data)) {
                                    res.data.forEach((item, index) => {
                                        updateOrAddRecordTask(item, res.data.length - 1 === index);
                                    })
                                }
                            })
                    })
            } catch (e) {

            }

        }
    }
    const syncDataDailyFromServer = async (user) => {
        if (user && isConnected) {
            setLoadingDataDaily(true);
            try {
                const userId = user.userType + "_" + user.id;
                const storage = getStorage();
                const starsRef = ref(storage, `${FIREBASE_ROOT_DAILY}/${userId}.json`);
                await getDownloadURL(starsRef)
                    .then((url) => {
                        axios.get(url)
                            .then(res => {
                                if (Array.isArray(res.data)) {
                                    res.data.forEach((item, index) => {
                                        updateOrAddRecordDaily(item, res.data.length - 1 === index);
                                    })
                                }
                                setLoadingDataDaily(false);
                            })
                            .catch(err => {
                                setLoadingDataDaily(false);
                            })
                    })
                    .catch(err => {
                        setLoadingDataDaily(false);
                    })
            } catch (e) {
                setLoadingDataDaily(false);
            }
        }
    }
    const updateOrAddRecordGroup = (data, done) => {
        const {
            uid,
            name,
            description,
            createdAt,
            updatedAt
        } = data;
        dbGroup.transaction(async (tx) => {
            tx.executeSql(
                "INSERT OR REPLACE INTO groups (ID, uid, name, description, createdAt, updatedAt)  VALUES ((SELECT ID from groups WHERE uid = ?),?,?,?,?,?)",
                [uid, uid, name, description, createdAt, updatedAt],
                () => {
                    if (done) {
                        getGroups();
                    }
                }
            )
        })
    }
    const updateOrAddRecordTask = (data, done) => {
        const {
            uid,
            group_uid,
            name,
            description,
            images,
            goal,
            unit,
            createdAt,
            updatedAt
        } = data;
        dbTask.transaction(async (tx) => {
            tx.executeSql(
                "INSERT OR REPLACE INTO tasks (ID, uid, group_uid, name, description, images, goal, unit, createdAt, updatedAt)  VALUES ((SELECT ID from tasks WHERE uid = ?),?,?,?,?,?,?,?,?,?)",
                [uid, uid, group_uid, name, description, JSON.stringify(images), goal, unit, createdAt, updatedAt],
                () => {
                    if (done) {
                        getTasks();
                    }
                },
                (err) => {
                    // console.log(err)
                },
            )

        })
    }
    const updateOrAddRecordDaily = (data, done) => {
        const {
            uid,
            goal,
            dailyGoal,
            note,
            task_uid,
            dailyDate,
            createdAt,
            updatedAt
        } = data;
        dbDaily.transaction(async (tx) => {
            tx.executeSql(
                "INSERT OR REPLACE INTO daily (ID, uid, goal, dailyGoal, note, task_uid, dailyDate, createdAt, updatedAt)  VALUES ((SELECT ID from daily WHERE uid = ?),?,?,?,?,?,?,?,?)",
                [uid, uid, goal, dailyGoal, note, task_uid, dailyDate, createdAt, updatedAt],
                (t,resultSet) => {
                    // console.log(resultSet)
                },
                (err) => {
                    // console.log(err)
                }
            )

        })
    }
    /*INITIAL DATA AFTER LOGIN*/

    // useEffect(() => {
    //     setViewAsyncData(true);
    //     setInterval(() => {
    //         if (isSync && isConnected) {
    //             if (isConnected) {
    //                 console.log('setViewAsyncData')
    //                 setViewAsyncData(true);
    //             }
    //         }
    //     }, TIME_SYNC_MIN*60*1000)
    // }, [])

    useEffect(() => {
        if (isConnected && isSync) {
            setViewAsyncData(true);
            const interval = setInterval(() => {
                // console.log('setViewAsyncData')
                setViewAsyncData(true);
            }, TIME_SYNC_MIN*60*1000)
            return () => clearInterval(interval);
        }
    }, [isConnected, isSync])
    const asyncSchedule = async () => {
        if (user) {
            if (lastChangeDBGroup && (!lastSyncDate || (lastSyncDate < lastChangeDBGroup))) {
                // setLastSyncDate(getCurrentTime());
                // setLastChangeDBGroup(null);
                // console.log('saveDataGroupToServer')
                await saveDataGroupToServer(false);
            }
            if (lastChangeDBTask && (!lastSyncDate || (lastSyncDate < lastChangeDBTask))) {
                // setLastSyncDate(getCurrentTime());
                // setLastChangeDBTask(null);
                // console.log('saveDataTaskToServer')
                await saveDataTaskToServer(false);
            }
            if (lastChangeDBDaily && (!lastSyncDate || (lastSyncDate < lastChangeDBDaily))) {
                // setLastSyncDate(getCurrentTime());
                // setLastChangeDBDaily(null);
                // console.log('saveDataDailyToServer')
                await saveDataDailyToServer(false);
            }
            if (lastChangeDBNote && (!lastSyncDate || (lastSyncDate < lastChangeDBNote))) {
                // setLastSyncDate(getCurrentTime());
                // setLastChangeDBNote(null);
                // console.log('saveDataNoteToServer')
                await saveDataNoteToServer(false);
            }
        }
        setViewAsyncData(false);
    }
    const createTableDBGroup = () => {
        dbGroup.transaction((tx) => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS "
                + "groups "
                + "(ID INTEGER PRIMARY KEY AUTOINCREMENT, uid TEXT, name TEXT, description TEXT, createdAt NUMERIC, updatedAt NUMERIC);"
            )
        })
    }
    const createTableTask = () => {
        dbTask.transaction((tx) => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS "
                + "tasks "
                + "(ID INTEGER PRIMARY KEY AUTOINCREMENT, uid TEXT, group_uid TEXT, name TEXT, description TEXT, images TEXT, goal INTEGER, unit TEXT, createdAt NUMERIC, updatedAt NUMERIC);"
            )
        })
    }
    const createTableDaily = () => {
        dbDaily.transaction((tx) => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS "
                + "daily "
                + "(ID INTEGER PRIMARY KEY AUTOINCREMENT, uid TEXT, goal INTEGER, dailyGoal INTEGER, note TEXT, task_uid TEXT, dailyDate TEXT, createdAt NUMERIC, updatedAt NUMERIC, UNIQUE(task_uid, dailyDate));"
            )
        })
    }
    const createTableNote = () => {
        dbNote.transaction((tx) => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS "
                + "note "
                + "(ID INTEGER PRIMARY KEY AUTOINCREMENT, uid TEXT, noteText TEXT, dailyDate TEXT, createdAt NUMERIC, updatedAt NUMERIC);"
            )
        })
    }
    const getGroups = () => {
        try {
            dbGroup.transaction((tx) => {
                tx.executeSql(
                    "SELECT uid, name, description, createdAt, updatedAt FROM groups",
                    [],
                    (tx, results) => {
                        let groupsTemp = []
                        for (let index = 0; index < results.rows.length; index++) {
                            if (index === 0) {
                                setGroupSelected(results.rows.item(index).uid);
                            }
                            groupsTemp = [
                                ...groupsTemp,
                                results.rows.item(index)
                            ]
                        }
                        groupsTemp = groupsTemp.sort((a, b) => moment(b.updatedAt) - moment(a.updatedAt))
                        setGroups(groupsTemp)
                    }
                )
            })
        } catch (error) {
            // console.log(error);
        }
    }
    const getTasks = () => {
        try {
            dbTask.transaction((tx) => {
                tx.executeSql(
                    "SELECT uid, group_uid, name, description, images, goal, unit, createdAt, updatedAt FROM tasks",
                    [],
                    (tx, results) => {
                        let tasksTemp = []
                        for (let index = 0; index < results.rows.length; index++) {
                            tasksTemp = [
                                ...tasksTemp,
                                {
                                    ...results.rows.item(index),
                                    images: JSON.parse(results.rows.item(index).images)
                                },
                            ]
                        }
                        tasksTemp = tasksTemp.sort((a, b) => moment(b.updatedAt) - moment(a.updatedAt))
                        setTasks(tasksTemp)
                    },
                    (err, error) => {
                        // console.log(error)
                    }
                )
            })
        } catch (error) {
            // console.log(error);
        }
    }

    /*SIGNIN - SIGNOUT*/
    const signInWithGoogle = async () => {
        if (isConnected) {
            setLoadingAsync(true);
            await GoogleSignin.configure({
                scopes: [],
                androidClientId: GOOGLE_CLIENT_ID
            });
            await GoogleSignin.hasPlayServices();
            // console.log('AAAAAAAAAAAAA')
            GoogleSignin
                .signIn()
                .then(async res => {
                    console.log(res)
                    const dataUser = res.user;
                    const firstName = (dataUser?.givenName ?? "").trim();
                    const lastName = (dataUser?.familyName ?? "").trim();
                    const dataUserTemp = {
                        ...dataUser,
                        firstName: firstName,
                        lastName: lastName,
                        fullName: (firstName + " " + lastName).trim(),
                        userType: USER_TYPE_GOOGLE,
                        loginDate: getCurrentTime()
                    }
                    await saveDataLoginToServer(dataUserTemp)
                    setLastSyncDate(getCurrentTime());
                    await getInitialDataAfterLogin(dataUserTemp);
                    setLoadingAsync(false);
                    setUser(dataUserTemp);
                })
                .catch(err => {
                    // alert(err)
                    setLoadingAsync(false);
                })
            ;
        } else {
            ToastAndroid.show(t('label.no_network'), ToastAndroid.SHORT);
        }
    }
    const signInWithFacebook = () => {
        if (isConnected) {
            setLoadingAsync(true);
            LoginManager.logInWithPermissions(["public_profile"]).then(
                function (result) {
                    if (result.isCancelled) {
                        setLoadingAsync(false);
                    } else {
                        AccessToken.getCurrentAccessToken().then((data) => {
                            const {accessToken} = data
                            fetch('https://graph.facebook.com/v2.5/me?fields=email,name,first_name,last_name,middle_name,friends&access_token=' + accessToken)
                                .then((response) => response.json())
                                .then(async (json) => {
                                    const dataUserTemp = {
                                        ...json,
                                        firstName: json.first_name ?? "",
                                        lastName: json.last_name ?? "",
                                        fullName: json.name ?? "",
                                        photo: `https://graph.facebook.com/${json.id}/picture?width=200&height=200&access_token=${accessToken}`,
                                        userType: USER_TYPE_FACEBOOK,
                                        loginDate: getCurrentTime()
                                    }
                                    await saveDataLoginToServer(dataUserTemp)
                                    setLastSyncDate(getCurrentTime());
                                    await getInitialDataAfterLogin(dataUserTemp);
                                    setLoadingAsync(false);
                                    setUser(dataUserTemp)
                                })
                                .catch(() => {
                                    setLoadingAsync(false);
                                })

                        })

                    }
                },
                function (error) {
                    setLoadingAsync(false);
                }
            );
        } else {
            ToastAndroid.show(t('label.no_network'), ToastAndroid.SHORT);
        }
    }
    const signOutWithGoogle = async () => {
        if (user?.id) {
            await saveDataGroupToServer(true);
            await saveDataTaskToServer(true);
            await saveDataDailyToServer(true);
            await saveDataNoteToServer(true);
            await resetData();
            await GoogleSignin.configure({
                scopes: [],
                androidClientId: GOOGLE_CLIENT_ID
            });
            GoogleSignin.signOut().then(res => {
                setUser(null);
            }).catch(err => {
                setUser(null);
            })
            setLoadingAsync(false);
        }
    }
    const signOutWithFacebook = async () => {
        if (user?.id) {
            await saveDataGroupToServer(true);
            await saveDataTaskToServer(true);
            await saveDataDailyToServer(true);
            await saveDataNoteToServer(true);
            await resetData();
            setUser(null);
            LoginManager.logOut();
            setLoadingAsync(false);
        }
    }
    const resetData = async () => {
        await dbGroup.transaction((tx) => {
            tx.executeSql(
                "DROP TABLE groups",
                [],
                (transaction, resultSet) => {
                    createTableDBGroup();
                }
            )
        })
        await dbTask.transaction((tx) => {
            tx.executeSql(
                "DROP TABLE tasks",
                [],
                (transaction, resultSet) => {
                    createTableTask()
                }
            )
        })
        await dbDaily.transaction((tx) => {
            tx.executeSql(
                "DROP TABLE daily",
                [],
                (transaction, resultSet) => {
                    createTableDaily()
                }
            )
        })
        await dbNote.transaction((tx) => {
            tx.executeSql(
                "DROP TABLE note",
                [],
                (transaction, resultSet) => {
                    createTableNote()
                }
            )
        })

        await AsyncStorage.removeItem(KEY_STORAGE_USER);
        await AsyncStorage.removeItem(KEY_STORAGE_LAST_SYNC_DATE);
        await AsyncStorage.removeItem(KEY_STORAGE_LAST_CHANGE_DB_GROUP);
        await AsyncStorage.removeItem(KEY_STORAGE_LAST_CHANGE_DB_TASK);
        await AsyncStorage.removeItem(KEY_STORAGE_LAST_CHANGE_DB_DAILY);
        await AsyncStorage.removeItem(KEY_STORAGE_LAST_CHANGE_DB_NOTE);
        setLastSyncDate(0);
        setLastChangeDBGroup(0);
        setLastChangeDBTask(0);
        setLastChangeDBDaily(0);
        setGroups([]);
        setTasks([]);
        setUser(null);
    }
    /*SIGNIN - SIGNOUT*/


    const signInWithGoogleToSync = async () => {
        if (isConnected) {
            if (!isSync) {
                setLoadingAsync(true);
                await GoogleSignin.configure({
                    scopes: [],
                    androidClientId: GOOGLE_CLIENT_ID
                });
                await GoogleSignin.hasPlayServices();
                GoogleSignin
                    .signIn()
                    .then(async res => {
                        const dataUser = res.user;
                        const firstName = (dataUser?.givenName ?? "").trim();
                        const lastName = (dataUser?.familyName ?? "").trim();
                        const dataUserTemp = {
                            ...dataUser,
                            firstName: firstName,
                            lastName: lastName,
                            fullName: (firstName + " " + lastName).trim(),
                            userType: USER_TYPE_GOOGLE,
                            loginDate: getCurrentTime()
                        }
                        const userId = USER_TYPE_GOOGLE + "_" + dataUser.id;
                        const storage = getStorage();
                        const starsRef = ref(storage, `${FIREBASE_ROOT_LOGIN}/${userId}.json`);
                        setLoadingAsync(true);
                        await getDownloadURL(starsRef)
                            .then(async (url) => {
                                await GoogleSignin.signOut();
                                ToastAndroid.show(t('label.account_exist'), ToastAndroid.SHORT);
                                setLoadingAsync(false);
                            })
                            .catch(async (err) => {
                                await saveDataGroupToServer(true, dataUserTemp);
                                await saveDataTaskToServer(true, dataUserTemp);
                                await saveDataDailyToServer(true, dataUserTemp);
                                await saveDataNoteToServer(true, dataUserTemp);
                                await saveDataLoginToServer(dataUserTemp)
                                setLastSyncDate(getCurrentTime());
                                // await getInitialDataAfterLogin(dataUserTemp);
                                setLoadingAsync(false);
                                setUser(dataUserTemp);
                            })
                    })
                    .catch(err => {
                        // alert(err)
                        setLoadingAsync(false);
                    })
            }
        } else {
            ToastAndroid.show(t('label.no_network'), ToastAndroid.SHORT);
        }
    }

    const signInWithFacebookToSync = () => {
        if (isConnected) {
            if (!isSync) {
                // console.log('setLoadingAsync')
                setLoadingAsync(true);
                LoginManager.logInWithPermissions(["public_profile"]).then(
                    function(result) {
                        if (result.isCancelled) {
                            setLoadingAsync(false);
                        } else {
                            AccessToken.getCurrentAccessToken().then((data) => {
                                const { accessToken } = data
                                fetch('https://graph.facebook.com/v2.5/me?fields=email,name,first_name,last_name,middle_name,friends&access_token=' + accessToken)
                                    .then((response) => response.json())
                                    .then(async (json) => {
                                        const dataUserTemp = {
                                            ...json,
                                            firstName: json.first_name ?? "",
                                            lastName: json.last_name ?? "",
                                            fullName: json.name ?? "",
                                            photo: `https://graph.facebook.com/${json.id}/picture?width=200&height=200&access_token=${accessToken}`,
                                            userType: USER_TYPE_FACEBOOK,
                                            loginDate: getCurrentTime()
                                        }

                                        const userId = USER_TYPE_FACEBOOK + "_" + dataUserTemp.id;
                                        const storage = getStorage();
                                        const starsRef = ref(storage, `${FIREBASE_ROOT_LOGIN}/${userId}.json`);
                                        setLoadingAsync(true);
                                        await getDownloadURL(starsRef)
                                            .then(async (url) => {
                                                await LoginManager.logOut();
                                                ToastAndroid.show(t('label.account_exist'), ToastAndroid.SHORT);
                                                setLoadingAsync(false);
                                            })
                                            .catch(async (err) => {
                                                await saveDataGroupToServer(true, dataUserTemp);
                                                await saveDataTaskToServer(true, dataUserTemp);
                                                await saveDataDailyToServer(true, dataUserTemp);
                                                await saveDataNoteToServer(true, dataUserTemp);
                                                await saveDataLoginToServer(dataUserTemp)
                                                setLastSyncDate(getCurrentTime());
                                                // await getInitialDataAfterLogin(dataUserTemp);
                                                setLoadingAsync(false);
                                                setUser(dataUserTemp);
                                            })
                                    })
                                    .catch(() => {
                                        setLoadingAsync(false);
                                    })

                            })

                        }
                    },
                    function(error) {
                        setLoadingAsync(false);
                    }
                );
            }
        } else {
            ToastAndroid.show(t('label.no_network'), ToastAndroid.SHORT);
        }
    }


    const checkLoginData = async () => {
        if (user?.id) {
            try {
                const userId = user.userType + "_" + user.id;
                const storage = getStorage();
                const starsRef = ref(storage, `${FIREBASE_ROOT_LOGIN}/${userId}.json`);
                setLoadingAsync(true);
                // console.log(starsRef)
                await getDownloadURL(starsRef)
                    .then((url) => {
                        axios.get(url)
                            .then(async res => {
                                if (res.data?.loginDate !== user.loginDate) {
                                    ToastAndroid.show(t('label.logout_message'), ToastAndroid.SHORT);
                                    if (user.userType === USER_TYPE_GOOGLE) {
                                        await GoogleSignin.configure({
                                            scopes: [],
                                            androidClientId: GOOGLE_CLIENT_ID
                                        });
                                        GoogleSignin.signOut().then(res => {
                                            setUser(null);
                                            setLoadingAsync(false);
                                        })
                                            .catch(err => {
                                                setLoadingAsync(false);
                                            })
                                    } else {
                                        LoginManager.logOut();
                                        setUser(null);
                                        setLoadingAsync(false);
                                    }
                                    await resetData();
                                } else {
                                    setLoadingAsync(false);
                                }
                            })
                            .catch(error => {
                                setLoadingAsync(false);
                            })
                    })
                    .catch(err => {
                        alert('AAAAAAAAA')
                        setLoadingAsync(false);
                    })
            } catch (e) {
                console.log(e);
            }
        }
    }
    const saveDataGroupToServer = async (checkSync, dataUser) => {
        if (isConnected) {
            try {
                dbGroup.transaction((tx) => {
                    setLoadingAsync(!!checkSync);
                    tx.executeSql(
                        "SELECT uid, name, description, createdAt, updatedAt FROM groups",
                        [],
                        async (tx, results) => {
                            let groupsTemp = []
                            for (let index = 0; index < results.rows.length; index++) {
                                groupsTemp = [
                                    ...groupsTemp,
                                    results.rows.item(index)
                                ]
                            }
                            const userId = dataUser ? dataUser.userType + "_" + dataUser.id : user.userType + "_" + user.id;
                            const storage = getStorage();
                            const refA = ref(storage, `${FIREBASE_ROOT_GROUP}/${userId}.json`);
                            const jsonString = JSON.stringify(groupsTemp);
                            const blob = new Blob([jsonString], {type: 'application/json'});
                            // console.log('AAAAAAAAAAAAA')
                            await uploadBytes(refA, blob);
                            setLastSyncDate(getCurrentTime());
                            setLastChangeDBGroup(null);
                            setLoadingAsync(false);
                        },
                        (err) => {
                            // alert(err)
                            setLoadingAsync(false);
                        }
                    )
                })
            } catch (error) {
                setLoadingAsync(false);
            }
        }
    }
    const saveDataTaskToServer = async (checkSync, dataUser) => {
        if (isConnected) {
            try {
                dbTask.transaction((tx) => {
                    setLoadingAsync(!!checkSync);
                    tx.executeSql(
                        "SELECT uid, group_uid, name, description, images, goal, unit, createdAt, updatedAt FROM tasks",
                        [],
                        async (tx, results) => {
                            let tasksTemp = []
                            for (let index = 0; index < results.rows.length; index++) {
                                tasksTemp = [
                                    ...tasksTemp,
                                    {
                                        ...results.rows.item(index),
                                        images: JSON.parse(results.rows.item(index).images)
                                    },
                                ]
                            }
                            const userId = dataUser ? dataUser.userType + "_" + dataUser.id : user.userType + "_" + user.id;
                            const storage = getStorage();
                            const refA = ref(storage, `${FIREBASE_ROOT_TASK}/${userId}.json`);
                            const jsonString = JSON.stringify(tasksTemp);
                            const blob = new Blob([jsonString], {type: 'application/json'});
                            await uploadBytes(refA, blob);
                            setLastSyncDate(getCurrentTime());
                            setLastChangeDBTask(null);
                            setLoadingAsync(false);
                        },
                        (err, error) => {
                            setLoadingAsync(false);
                        }
                    )
                })
            } catch (error) {
                setLoadingAsync(false);
            }
        }
    }
    const saveDataDailyToServer = async (checkSync, dataUser) => {
        if (isConnected) {
            try {
                dbDaily.transaction((tx) => {
                    setLoadingAsync(!!checkSync);
                    tx.executeSql(
                        "SELECT uid, goal, dailyGoal, note, task_uid, dailyDate, createdAt, updatedAt FROM daily",
                        [],
                        async (tx, results) => {
                            let tasksTemp = []
                            for (let index = 0; index < results.rows.length; index++) {
                                tasksTemp = [
                                    ...tasksTemp,
                                    results.rows.item(index),
                                ]
                            }

                            const userId = dataUser ? dataUser.userType + "_" + dataUser.id : user.userType + "_" + user.id;
                            const storage = getStorage();
                            const refA = ref(storage, `${FIREBASE_ROOT_DAILY}/${userId}.json`);
                            const jsonString = JSON.stringify(tasksTemp);
                            const blob = new Blob([jsonString], {type: 'application/json'});
                            await uploadBytes(refA, blob);
                            setLastSyncDate(getCurrentTime());
                            setLastChangeDBTask(null);
                            setLoadingAsync(false);
                        },
                        (err) => {
                            setLoadingAsync(false);
                        }
                    )
                })
            } catch (error) {
                setLoadingAsync(false);
            }
        }
    }
    const saveDataNoteToServer = (checkSync, dataUser) => {
        if (isConnected) {
            try {
                dbNote.transaction((tx) => {
                    setLoadingAsync(!!checkSync);
                    tx.executeSql(
                        "SELECT uid, noteText, createdAt, updatedAt FROM note",
                        [],
                        async (tx, results) => {
                            let notesTemp = []
                            for (let index = 0; index < results.rows.length; index++) {
                                notesTemp = [
                                    ...notesTemp,
                                    results.rows.item(index),
                                ]
                            }
                            const userId = dataUser ? dataUser.userType + "_" + dataUser.id : user.userType + "_" + user.id;
                            const storage = getStorage();
                            const refA = ref(storage, `${FIREBASE_ROOT_NOTE}/${userId}.json`);
                            const jsonString = JSON.stringify(notesTemp);
                            const blob = new Blob([jsonString], {type: 'application/json'});
                            await uploadBytes(refA, blob);
                            setLastSyncDate(getCurrentTime());
                            setLastChangeDBTask(null);
                            setLoadingAsync(false);
                        },
                        (err) => {
                            setLoadingAsync(false);
                        }
                    )
                })
            } catch (error) {
                setLoadingAsync(false);
            }
        }
    }
    const saveDataLoginToServer = async (user) => {
        if (isConnected) {
            const userId = user.userType + "_" + user.id;
            const storage = getStorage();
            const refA = ref(storage, `${FIREBASE_ROOT_LOGIN}/${userId}.json`);
            const jsonString = JSON.stringify(user);
            const blob = new Blob([jsonString], {type: 'application/json'});
            await uploadBytes(refA, blob);
        }
    }


    /*CONTINUE NOT SYNC*/
    const continueNotSync = () => {
        const dataUserNotSync = {
            userType: USER_TYPE_LOCAL,
        }
        setUser(dataUserNotSync);
    }

    const deleteDataNotSync = async () => {
        setLoadingAsync(true);
        await resetData();
        setLoadingAsync(false);
    }

    const appContextData = {
        theme,
        setTheme,
        groups,
        getGroups,
        tasks,
        getTasks,
        setGroupSelected,
        dbGroup,
        groupSelected,
        dbTask,
        loadingTheme,
        dailyDate,
        setDailyDate,
        dbDaily,
        viewImageModal,
        setViewImageModal,
        loadingUser,
        user,
        setUser,
        signOutWithGoogle,
        signInWithGoogle,
        signInWithFacebook,
        signOutWithFacebook,
        lastSyncDate,
        setLastSyncDate,
        lastChangeDBGroup,
        setLastChangeDBGroup,
        lastChangeDBTask,
        setLastChangeDBTask,
        lastChangeDBDaily,
        setLastChangeDBDaily,
        lastChangeDBNote,
        setLastChangeDBNote,
        language,
        setLanguage,
        loadingLanguage,
        setLoadingLanguage,
        loadingAsync,
        setLoadingAsync,
        asyncSchedule,
        viewAsyncData,
        checkLoginData,
        syncDataGroupFromServer,
        syncDataTaskFromServer,
        syncDataDailyFromServer,
        loadingDataDaily,
        dbNote,
        continueNotSync,
        isSync,
        signInWithGoogleToSync,
        signInWithFacebookToSync,
        deleteDataNotSync,
        isConnected
    }
    // console.log(loadingAsync)
    return (
        <AppContext.Provider value={appContextData}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;
