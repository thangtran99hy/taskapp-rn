import React, {useContext, useEffect, useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { v4 as uuid } from 'uuid';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {AppContext} from '../contexts/AppContext';
import {THEME_DARK} from '../utils/constants';
import Input from '../themes/Input';
import moment from 'moment';
import BtnSave from '../components/BtnSave';
import {useTranslation} from 'react-i18next';
import {getCurrentTime} from '../utils/functions';
const initialGroup = {
    uid: '',
    name: '',
    description: '',
    createdAt: null,
    updatedAt: null
}
const Group = (props) => {
    const {t} = useTranslation();
    const {
        theme,
        groups,
        getGroups,
        tasks,
        dbGroup,
        setLastChangeDBGroup,
        isSync,
    } = useContext(AppContext);
    const {

    } = props;
    const [group,setGroup] = useState({...initialGroup})
    const {
        uid,
        name,
        description,
        createdAt,
        updatedAt,
    } = group;
    const onChangeGroup = (name, value) => {
        setGroup(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const saveGroup = () => {
        if (name.trim().length === 0) {
            alert(t('group.name_required'))
            return null;
        }
        try {
            dbGroup.transaction(async (tx) => {
                const uid = uuid();
                const timeNow = getCurrentTime();
                tx.executeSql(
                    "INSERT INTO groups (uid, name, description, createdAt, updatedAt) VALUES (?,?,?,?,?)",
                    [uid, name, description, timeNow, timeNow]
                );
                if (isSync) {
                    setLastChangeDBGroup(timeNow);
                }
                setGroup({...initialGroup})
                getGroups();
            })
        } catch (error) {
            return error;
        }
    }

    const removeGroup = (uid) => {
        if (uid === group.uid) {
            setGroup({...initialGroup})
        }
        dbGroup.transaction(async (tx) => {
            const timeNow = getCurrentTime();
            tx.executeSql('DELETE FROM groups WHERE uid = ?',[uid]);
            if (isSync) {
                setLastChangeDBGroup(timeNow);
            }
            getGroups();
        })
    }

    const updateGroup = () => {
        if (name.trim().length === 0) {
            alert(t('group.name_required'))
            return null;
        }
        try {
            dbGroup.transaction((tx) => {
                const timeNow = getCurrentTime();
                tx.executeSql(
                    "UPDATE groups SET name = ?, description = ?, updatedAt = ? WHERE uid = ?",
                    [name, description, timeNow, uid]
                );
                if (isSync) {
                    setLastChangeDBGroup(timeNow);
                }
                setGroup({...initialGroup})
                getGroups();
            })
        } catch (error) {
            // console.log(error);
        }
    }

    const displayRemoveGroupAlert = (uid) => {
        Alert.alert(t('label.sure'), t('group.message_delete'), [
            {
                text: t('label.delete'),
                onPress: () => {
                    removeGroup(uid)
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

    const isThemeDark = theme === THEME_DARK;
    return (
        <View style={[styles.container, (isThemeDark ? styles.container_dark : {})]}>
            <View style={styles.header}>
                   <View style={styles.textHeaderWrapper}>
                       <Text style={[styles.textHeader, (isThemeDark ? styles.textHeader_dark : {})]}>
                           {uid !== "" ? t('label.edit') : t('label.add')}
                       </Text>
                       {uid !== "" ? <Text style={[styles.textHeaderUid, (isThemeDark ? styles.textHeaderUid_dark : {})]}>{uid}</Text> : null}
                   </View>
                {uid !== "" ? <MaterialIcon
                    name="cancel"
                    size={24}
                    color={isThemeDark ? '#fff' : '#434343'}
                    onPress={() => {
                        setGroup({...initialGroup})
                    }}
                /> : null}
            </View>
            <Input
                value={name}
                onChangeText={(text) => {
                    onChangeGroup('name', text)
                }}
                placeholder={t('group.name')}
            />
            <Input
                value={description}
                onChangeText={(text) => {
                    onChangeGroup('description', text)
                }}
                multiline={true}
                style={styles.inputDescription}
                placeholder={t('group.description')}
            />
            <BtnSave
                onPress={()=>{
                    if (uid !== "") {
                        updateGroup();
                    } else {
                        saveGroup()
                    }
                }}
                text={t('group.saveGroup')}
            />
            <View style={styles.groupsContainer}>
                <FlatList
                    data={groups}
                    renderItem={({item}) => {
                        const hasTask = tasks.find(itemTask => itemTask.group_uid === item.uid)
                        return (
                            <TouchableOpacity style={[styles.groupItem, (isThemeDark ? styles.groupItem_dark : {})]} key={item.uid} onPress={() => {
                                setGroup({
                                    ...item
                                })
                            }}>
                                <Text style={[styles.groupItemName, (isThemeDark ? styles.groupItemName_dark : {})]}>{item.name}</Text>
                                <Text style={[styles.groupItemDescription, (isThemeDark ? styles.groupItemDescription_dark : {})]}>{item.description}</Text>
                                <View style={styles.groupItemUpdatedAt}>
                                    <IonIcon name="timer-outline" color={isThemeDark ? "#fff": '#5d4bae'}/>
                                    <Text style={[styles.groupItemUpdatedAtText, (isThemeDark ? styles.groupItemUpdatedAtText_dark : {})]}>{moment(item.updatedAt).format('llll')}</Text>
                                </View>
                                {!hasTask ? <IonIcon color={isThemeDark ? "#fff" : "#5d4bae"} name="remove-circle" style={[styles.deleteIcon, (isThemeDark ? styles.deleteIcon_dark : {})]} size={30} onPress={() => {
                                    displayRemoveGroupAlert(item.uid);
                                }}/> : null}
                            </TouchableOpacity>
                        )
                    }}
                    keyExtractor={item => item.uid}
                />
            </View>
        </View>
    )
}

export default Group;

const styles = StyleSheet.create({
    container: {
        padding: 10,
        height: '100%',
        backgroundColor: '#e8ebfc',
        paddingBottom: 80,
    },
    container_dark: {
        backgroundColor: '#646187'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    textHeaderWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    textHeader: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#434343',
        textTransform: 'uppercase'
    },
    textHeader_dark: {
        color: '#fff',
    },
    textHeaderUid: {
        flex: 1,
        paddingHorizontal: 20,
        fontSize: 15,
        textAlign: 'center'
    },
    textHeaderUid_dark: {
        color: '#c9c7d6'
    },
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
    inputDescription: {
        height: 100,
    },
    groupsContainer: {
        flex: 1,
        paddingVertical: 5
    },
    groupItem: {
        backgroundColor: '#ffffff',
        marginVertical: 5,
        padding: 10,
        paddingRight: 40,
        borderRadius: 5,
    },
    groupItem_dark: {
        backgroundColor: '#4e4a6e',
    },
    groupItemName: {
        fontWeight: '600',
        fontSize: 18,
        color: '#434343'
    },
    groupItemName_dark: {
        color: '#fff',
    },
    groupItemDescription: {
        fontSize: 15,
        color: '#4b4b4b',
        fontWeight: '300'
    },
    groupItemDescription_dark: {
        color: '#9d9ba7',
    },
    groupItemUpdatedAt: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
        justifyContent: 'flex-end'
    },
    groupItemUpdatedAtText: {
        color: '#5a5a5a',
        fontSize: 12,
        paddingLeft: 5,
        fontWeight: '300'
    },
    groupItemUpdatedAtText_dark: {
        color: '#d3cfe2',
    },
    deleteIcon: {
        position: 'absolute',
        right: 10,
        top: 10,
    },
    deleteIcon_dark: {

    }
})
