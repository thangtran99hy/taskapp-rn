import {ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AddDailyTask from './AddDailyTask';
import {AppContext} from '../contexts/AppContext';
import moment from 'moment';
import {THEME_DARK} from '../utils/constants';
import CircularProgress from './CircularProgress';
import Input from '../themes/Input';
import BtnSave from './BtnSave';
import {useTranslation} from 'react-i18next';
import {getCurrentTime} from '../utils/functions';
import {v4 as uuid} from 'uuid';

const initialNote = {
    noteText: '',
}

const DailyNote = (props) => {
    const {t} = useTranslation();
    const {

    } = props;
    const {
        theme,
        dailyDate,
        dbDaily,
        setViewImageModal,
        setLastChangeDBNote,
        setLoadingAsync,
        dbNote,
        isSync
    } = useContext(AppContext);
    const [noteDaily, setNoteDaily] = useState({...initialNote});
    const [isEdit, setIsEdit] = useState(false);
    const {
        noteText,
        uid
    } = noteDaily;
    // useEffect(() => {
    //     getDailyNote();
    // }, [])

    useEffect(() => {
        setIsEdit(false);
        setNoteDaily({...initialNote});
        getDailyNote();
    }, [dailyDate])

    const addNote = () => {
        setLoadingAsync(true);
        dbNote.transaction(async (tx) => {
            const uid = uuid();
            const timeNow = getCurrentTime();
            tx.executeSql(
                "INSERT INTO note (uid, noteText, dailyDate, createdAt, updatedAt) VALUES (?,?,?,?,?)",
                [uid, noteText, dailyDate.format('MM/DD/YYYY'), timeNow, timeNow],
                (transaction, resultSet) => {
                    if (isSync) {
                        setLastChangeDBNote(timeNow)
                    }
                    getDailyNote();
                    setIsEdit(false);
                    setLoadingAsync(false);
                },
                (err) => {
                    setLoadingAsync(false);
                }
            );

        })
    }

    const updateNote = () => {
        try {
            setLoadingAsync(true);
            dbNote.transaction(async (tx) => {
                const timeNow = getCurrentTime();
                tx.executeSql(
                    "UPDATE note SET noteText = ?, updatedAt = ? WHERE uid = ?",
                    [noteText, timeNow, uid],
                    () => {
                        if (isSync) {
                            setLastChangeDBNote(timeNow);
                        }
                        getDailyNote();
                        setIsEdit(false);
                        setLoadingAsync(false);
                    },
                    (err) => {
                        setLoadingAsync(false);
                    }
                );

            })
        } catch (error) {
            setLoadingAsync(false);
            return error;
        }
    }

    const getDailyNote = () => {
        try {
            dbNote.transaction((tx) => {
                tx.executeSql(
                    "SELECT uid, noteText, dailyDate, createdAt, updatedAt FROM note WHERE dailyDate = ?",
                    [dailyDate.format('MM/DD/YYYY')],
                    (tx, results) => {
                        if (results.rows.length > 0) {
                            setNoteDaily(prev => ({
                                ...initialNote,
                                ...results.rows.item(0)
                            }))
                        }
                    },
                    err => {
                    }
                )
            })
        } catch (error) {

        }
    }
    const isThemeDark = theme === THEME_DARK;
    return (
        <View style={[styles.container, (isThemeDark ? styles.container_dark : {})]}>
            <View style={styles.header}>
                <Text style={[styles.labelText, (isThemeDark ? styles.labelText_dark : {})]}>
                    Daily note
                </Text>
                <IonIcon
                    name={isEdit ? 'close-circle' : 'create-outline'}
                    size={24}
                    color={isThemeDark ? "#fff" : "#646187"}
                    onPress={() => {
                        setIsEdit(prev => !prev)
                    }}
                />
            </View>
            {
                isEdit ?
                    <>
                        <Input
                            multiline={true}
                            style={styles.inputNote}
                            value={noteText}
                            onChangeText={(text) => {
                                setNoteDaily(prev => ({
                                    ...prev,
                                    noteText: text
                                }))
                            }}
                        />
                        <BtnSave
                            onPress={()=>{
                                if (uid) {
                                    updateNote();
                                } else {
                                    addNote()
                                }
                            }}
                            text={t('task.saveTask')}
                            style={styles.btnSave}
                        />
                    </>
                    :
                    <Text style={[styles.noteText, (isThemeDark ? styles.noteText_dark : {})]}>
                        {noteText}
                    </Text>
            }
        </View>
    )
}

export default DailyNote;

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#fec89a',
        borderRadius: 5,
        marginBottom: 20
    },
    container_dark: {
        // backgroundColor: '#b9b6ca',
        backgroundColor: '#4e4a6e',
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    labelText: {
        fontSize: 16,
        color: '#5a5a5a',
        fontWeight: '600',
    },
    labelText_dark: {
        color: '#fff'
    },
    noteText: {
        color: '#4b4b4b'
    },
    noteText_dark: {
        color: '#9d9ba7',
    },
    inputNote: {
        height: 100,
    }
})
