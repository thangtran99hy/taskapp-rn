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
    Alert,
} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {Picker} from '@react-native-picker/picker';
import TaskFormModal from '../components/TaskFormModal';
import {AppContext} from '../contexts/AppContext';
import {THEME_DARK} from '../utils/constants';
import moment from 'moment';
import {useTranslation} from 'react-i18next';
import DeleteTaskIcon from '../components/DeleteTaskIcon';
import {getCurrentTime} from '../utils/functions';


const Task = (props) => {
    const {t} = useTranslation();
    const {
        navigation
    } = props;
    const {
        theme,
        setTheme,
        groups,
        getGroups,
        tasks,
        getTasks,
        dbTask,
        groupSelected,
        setGroupSelected,
        setViewImageModal,
        setLastChangeDBTask,
        isSync
    } = useContext(AppContext);
    const [task, setTask] = useState(null);
    const [visibleFormModal, setVisibleFormModal] = useState(false);

    const removeTask = (uid) => {
        dbTask.transaction(async (tx) => {
            tx.executeSql('DELETE FROM tasks WHERE uid = ?',[uid]);
            getTasks();
        })
        if (isSync) {
            setLastChangeDBTask(getCurrentTime());
        }
    }

    const displayRemoveTaskAlert = (uid) => {
        Alert.alert(t('label.sure'), t('task.message_delete'), [
            {
                text: t('label.delete'),
                onPress: () => {
                    removeTask(uid)
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
    const tasksByGroup = tasks.filter(item => {
        return item.group_uid === groupSelected;
    })
    return (
        <>
            <View style={[styles.container, (isThemeDark ? styles.container_dark : {})]}>
                <View style={[styles.pickerContainer, (isThemeDark ? styles.pickerContainer_dark : {})]}>
                    <Picker
                        selectedValue={groupSelected}
                        onValueChange={(itemValue, itemIndex) => setGroupSelected(itemValue)}
                        style={[styles.pickerGroup, (isThemeDark ? styles.pickerGroup_dark : {})]}
                        itemStyle={styles.pickerGroupItem}
                        mode="dialog"
                        dropdownIconColor={isThemeDark ? '#fff' : "#434343"}
                    >
                        {
                            groups.map((item) => {
                                return (
                                    <Picker.Item style={styles.pickerGroupItem} label={item.name} value={item.uid} key={item.uid}/>
                                )
                            })
                        }
                    </Picker>
                </View>
                {
                    groupSelected != null ?
                        <>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start'
                                }}
                            >
                                <IonIcon
                                    name="add"
                                    onPress={() => {
                                        setVisibleFormModal(true)
                                    }}
                                    size={36}
                                    color={isThemeDark ? "#fff": "#48489f"}
                                />
                            </View>
                            <View style={styles.tasksContainer}>
                                <FlatList
                                    data={tasksByGroup}
                                    renderItem={({item}) => {
                                        return (
                                            <View style={[styles.groupItem, (isThemeDark ? styles.groupItem_dark : {})]} key={item.uid}>
                                                <Text style={[styles.groupItemName, (isThemeDark ? styles.groupItemName_dark : {})]}>{item.name}</Text>
                                                <Text style={[styles.groupItemDescription, (isThemeDark ? styles.groupItemDescription_dark : {})]}>{item.description}</Text>
                                                <FlatList
                                                    data={item.images}
                                                    renderItem={({item}) => {
                                                        return (
                                                            <TouchableOpacity
                                                                style={styles.imageContainer}
                                                                onPress={() => {
                                                                    setViewImageModal(item);
                                                                }}
                                                            >
                                                                <Image
                                                                    source={{
                                                                        uri: item
                                                                    }}
                                                                    style={{
                                                                        height: 100,
                                                                        width: 100
                                                                    }}
                                                                />
                                                            </TouchableOpacity>
                                                        )
                                                    }}
                                                    keyExtractor={(item, index) => index}
                                                    horizontal={true}
                                                />
                                                <View style={styles.targetAndUnit}>
                                                    <Text style={[styles.targetText, (isThemeDark ? styles.targetText_dark : {})]}>
                                                        {item.goal}
                                                    </Text>
                                                    <Text style={[styles.unitText, (isThemeDark ? styles.unitText_dark : {})]}>
                                                        {item.unit}
                                                    </Text>
                                                </View>
                                                <View style={styles.groupItemUpdatedAt}>
                                                    <IonIcon name="timer-outline" color={isThemeDark ? "#fff": '#5d4bae'}/>
                                                    <Text style={[styles.groupItemUpdatedAtText, (isThemeDark ? styles.groupItemUpdatedAtText_dark : {})]}>{moment(item.updatedAt).format('llll')}</Text>
                                                </View>
                                                {/*<IonIcon color={isThemeDark ? "#fff" : "#5d4bae"} name="remove-circle" style={styles.deleteIcon} size={30} onPress={() => {*/}
                                                {/*    displayRemoveTaskAlert(item.uid);*/}
                                                {/*}}/>*/}
                                                <DeleteTaskIcon
                                                    onDelete={() => {
                                                        displayRemoveTaskAlert(item.uid)
                                                    }}
                                                    task={item}
                                                />
                                                <IonIcon color={isThemeDark ? "#fff" : "#5d4bae"} name="pencil" style={styles.editIcon} size={20} onPress={() => {
                                                    setVisibleFormModal(true);
                                                    setTask(item);
                                                }}/>
                                            </View>
                                        )
                                    }}
                                    keyExtractor={item => item.uid}
                                />
                            </View>
                            {visibleFormModal ? <TaskFormModal
                                visible={visibleFormModal}
                                onClose={() => {
                                    setVisibleFormModal(false);
                                    setTask(null)
                                }}
                                dataInitial={task}
                            /> : null}
                        </>
                        :
                        <View style={styles.noGroupContainer}>
                            <Text style={[styles.noGroupText, (isThemeDark ? styles.noGroupText_dark : {})]}>
                                {t('task.no_group')}
                            </Text>
                            <TouchableOpacity style={styles.addGroupBtn} onPress={() => {
                                navigation.navigate('Group');
                            }}>
                                <Text style={[styles.addGroupText, (isThemeDark ? styles.addGroupText_dark : {})]}>
                                    {t('task.add_group')}
                                </Text>
                                <IonIcon
                                    name="add-circle"
                                    size={24}
                                    color={isThemeDark ? "#fff" : "#5d4bae"}
                                />
                            </TouchableOpacity>
                        </View>
                }
            </View>
        </>
    )
}

export default Task;

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
        justifyContent: 'space-between',
    },
    btnCancel: {

    },
    input: {
        borderColor: '#8FBDD3',
        borderWidth: 2,
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 5,
    },
    inputDescription: {
        height: 100,
    },
    tasksContainer: {
        flex: 1,
        paddingVertical: 5
    },
    groupItem: {
        backgroundColor: '#ffffff',
        marginVertical: 5,
        padding: 10,
        // justifyContent: 'center',
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
    editIcon: {
        position: 'absolute',
        right: 10,
        top: 15,
    },
    deleteIcon: {
        position: 'absolute',
        right: 10,
        top: 10,
    },
    pickerContainer: {
        backgroundColor: '#fff',
        borderRadius: 5,
        marginBottom: 5,
    },
    pickerContainer_dark: {
        backgroundColor: '#7a789a',
    },
    pickerGroup: {
        color: '#3a3a3a',
        fontWeight: 'bold',
    },
    pickerGroup_dark: {
        color: '#fff',
    },
    pickerGroupItem: {
        color: '#3a3a3a',
    },
    imageContainer: {
        padding: 10,
    },
    noGroupContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    noGroupText: {
        fontSize: 18,
        fontWeight: '300',
        marginBottom: 40,
        color: '#4b4b4b'
    },
    noGroupText_dark: {
        color: '#fff'
    },
    addGroupBtn: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    addGroupText: {
        textTransform: 'uppercase',
        fontWeight: '400',
        fontSize: 15,
        color: '#5d4bae'
    },
    addGroupText_dark: {
        color: '#fff',
    },
    targetAndUnit: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
    },
    targetText: {
        fontWeight: '600',
        fontSize: 30
    },
    targetText_dark: {
        color: '#fff'
    },
    unitText: {
        fontWeight: '400'
    },
    unitText_dark: {
        color: '#f4f6fc'
    }
})
