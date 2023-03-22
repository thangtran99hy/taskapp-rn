import React, {useContext, useState} from 'react';
import {
    ActivityIndicator,
    Image,
    Modal, ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {v4 as uuid} from 'uuid';
import Input from '../themes/Input';
import {AppContext} from '../contexts/AppContext';
import {THEME_DARK} from '../utils/constants';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import BtnSave from './BtnSave';
import {useTranslation} from 'react-i18next';
import {getCurrentTime} from '../utils/functions';
import LoadingAsync from './LoadingAsync';
const initialTask = {
    uid: '',
    group: '',
    name: '',
    description: '',
    images: [],
    goal: '',
    unit: '',
    createdAt: null,
    updatedAt: null
}
const TaskFormModal = (props) => {
    const {t} = useTranslation();
    const {
        theme,
        setTheme,
        groupSelected,
        dbTask,
        getTasks,
        setLastChangeDBTask,
        setLoadingAsync,
        loadingAsync
    } = useContext(AppContext);
    const {
        visible,
        onClose,
        dataInitial,

    } = props;
    const [task,setTask] = useState({...initialTask,...(dataInitial ? {...dataInitial, goal: dataInitial.goal ? dataInitial.goal.toString() : ''} : {})});

    const {
        uid,
        name,
        description,
        images,
        goal,
        unit,
        createdAt,
        updatedAt,
    } = task;

    const addTask = () => {
        if (name.trim().length === 0) {
            alert(t('task.name_required'))
            return null;
        }
        try {
            setLoadingAsync(true);
            dbTask.transaction(async (tx) => {
                const uid = uuid();
                const timeNow = getCurrentTime();
                tx.executeSql(
                    "INSERT INTO tasks (uid, group_uid, name, description, images, goal, unit, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,?,?)",
                    [uid, groupSelected, name, description, JSON.stringify(images), goal, unit, timeNow, timeNow],
                    (t, resultSet) => {
                        getTasks();
                        setLastChangeDBTask(timeNow);
                        onClose();
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
    const updateTask = () => {
        if (name.trim().length === 0) {
            alert(t('task.name_required'))
            return null;
        }
        try {
            setLoadingAsync(true);
            dbTask.transaction((tx) => {
                const timeNow = getCurrentTime();
                tx.executeSql(
                    "UPDATE tasks SET name = ?, description = ?, images = ?, goal = ?, unit = ?, updatedAt = ? WHERE uid = ?",
                    [name, description, JSON.stringify(images), goal, unit, timeNow, uid],
                    () => {
                        setLastChangeDBTask(timeNow);
                        setTask({...initialTask})
                        getTasks();
                        onClose();
                        setLoadingAsync(false);
                    },
                    err => {
                        setLoadingAsync(false);
                    }
                );
            })
        } catch (error) {
            setLoadingAsync(false);
        }
    }
    const onChangeGroup = (name, value) => {
        setTask(prev => ({
            ...prev,
            [name]: value
        }))
    }
    const isThemeDark = theme === THEME_DARK;

    return (
        <Modal
            visible={visible}
            animationType='fade'
            onRequestClose={() => {
                onClose();
            }}
        >
            {loadingAsync ?  <LoadingAsync /> : null}
            <ScrollView style={[styles.container, (isThemeDark ? styles.container_dark : {})]}>
                <View style={styles.header}>
                    <View style={styles.textHeaderWrapper}>
                        <Text style={[styles.textHeader, (isThemeDark ? styles.textHeader_dark : {})]}>
                            {uid !== "" ? t('label.edit') : t('label.add')}
                        </Text>
                        {uid !== "" ? <Text style={[styles.textHeaderUid, (isThemeDark ? styles.textHeaderUid_dark : {})]}>{uid}</Text> : null}
                    </View>
                    <MaterialIcon
                        name="cancel"
                        size={24}
                        color={isThemeDark ? '#fff' : '#434343'}
                        onPress={() => {
                            onClose();
                        }}
                    />
                </View>
                <Input
                    value={name}
                    onChangeText={(text) => {
                        onChangeGroup('name', text)
                    }}
                    placeholder="Name"
                />
                <Input
                    value={description}
                    onChangeText={(text) => {
                        onChangeGroup('description', text)
                    }}
                    multiline={true}
                    style={styles.inputDescription}
                    placeholder="Description"
                />
                <View style={styles.labelImages}>
                    <Text style={[styles.labelImagesText, (isThemeDark ? styles.labelImagesText_dark : {})]}>
                        {t('task.images')}
                    </Text>
                    <Ionicons name="add" size={30} style={[styles.iconAdd, (isThemeDark ? styles.iconAdd_dark : {})]} onPress={() => {
                        setTask(prev => ({
                            ...prev,
                            images: [
                                ...prev.images,
                                ''
                            ]
                        }))
                    }}/>
                </View>
                {
                    images.map((item, index) => {
                        return (
                            <View style={styles.imageItem} key={index}>
                                <Input
                                    style={styles.inputImage}
                                    placeholder={t('task.linkImage') + (index + 1)}
                                    value={item}
                                    onChangeText={(text) => {
                                        setTask(prev => ({
                                            ...prev,
                                            images: prev.images.map((itemC, indexC) => {
                                                if (index === indexC) {
                                                    return text
                                                }
                                                return itemC
                                            })
                                        }))
                                    }}
                                />
                                <View style={styles.imageContainer}>
                                    {item ? <Image
                                        source={{
                                            uri: item
                                        }}
                                        style={styles.image}
                                    /> : null}
                                </View>
                            </View>
                        )
                    })
                }
                <Input
                    value={goal}
                    onChangeText={(text) => {
                        onChangeGroup('goal', text)
                    }}
                    placeholder={t('task.goal')}
                    keyboardType="numeric"
                />
                <Input
                    value={unit}
                    onChangeText={(text) => {
                        onChangeGroup('unit', text)
                    }}
                    placeholder={t('task.unit')}
                />
                <BtnSave
                    onPress={()=>{
                        if (uid !== "") {
                            updateTask();
                        } else {
                            addTask()
                        }
                    }}
                    text={t('task.saveTask')}
                    style={styles.btnSave}
                />
            </ScrollView>
        </Modal>
    )
}

export default TaskFormModal;

const styles = StyleSheet.create({
    container: {
        padding: 10,
        height: '100%',
        backgroundColor: '#e8ebfc',
        // paddingBottom: 70
    },
    container_dark: {
        backgroundColor: '#646187'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    labelImages: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 10,
    },
    labelImagesText: {
        flex: 1,
        fontWeight: '600',
        textTransform: 'uppercase'
    },
    labelImagesText_dark: {
        color: '#fff',

    },
    iconAdd: {
        color: '#3939b7',
    },
    iconAdd_dark: {
        color: '#fff'
    },
    imageItem: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    imageContainer: {
        width: 150,
        paddingVertical: 5,
        paddingLeft: 10,
    },
    image: {
        width: 120,
        height: 90,
    },
    inputImage: {
        flex: 1,
    },
    btnSave: {
        marginTop: 10,
        marginBottom: 20,
    }
})
