import React, {useContext, useEffect, useState} from 'react';
import {Dimensions, Modal, StyleSheet, Text, View} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {AppContext} from '../contexts/AppContext';
import {THEME_DARK} from '../utils/constants';
import moment from 'moment';
import Input from '../themes/Input';
import BtnSave from './BtnSave';
import {v4 as uuid} from 'uuid';
import {useTranslation} from 'react-i18next';
import {getCurrentTime} from '../utils/functions';
import LoadingAsync from './LoadingAsync';

const initialDailyTask = {
    dailyGoal: '',
    note: '',
}
const AddDailyTask = (props) => {
    const { t } = useTranslation();
    const {
        theme,
        dailyDate,
        dbDaily,
        setLastChangeDBDaily,
        setLoadingAsync,
        isSync,
        loadingAsync,
        language
    } = useContext(AppContext);

    const {
        visible,
        onClose,
        task,
        dataInitial,
        submitAddDailyTask
    } = props;
    const [dailyTask, setDailyTask] = useState({
        ...initialDailyTask,
        ...(dataInitial ? {...dataInitial, dailyGoal: dataInitial.dailyGoal ? dataInitial.dailyGoal.toString() : ''} : {})
    });
    const {
        dailyGoal,
        note,
        uid
    } = dailyTask;
    const onChangeDailyTask = (name, value) => {
        setDailyTask(prev => ({
            ...prev,
            [name]: value
        }))
    }
    const isThemeDark = theme === THEME_DARK;
    const addDailyTask = () => {
        if (dailyGoal.trim().length === 0) {
            alert(t('daily.goal_required'))
            return null;
        }
        try {
            setLoadingAsync(true);
            dbDaily.transaction(async (tx) => {
                const uid = uuid();
                const timeNow = getCurrentTime();
                tx.executeSql(
                    "INSERT INTO daily (uid, goal, dailyGoal, note, task_uid, dailyDate, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,?)",
                    [uid, task.goal, dailyGoal, note, task.uid, dailyDate.format('MM/DD/YYYY'), timeNow, timeNow],
                    () => {
                        if (isSync) {
                            setLastChangeDBDaily(timeNow);
                        }
                        submitAddDailyTask();
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
    const updateDailyTask = () => {
        if (dailyGoal.trim().length === 0) {
            alert(t('daily.goal_required'))
            return null;
        }
        try {
            setLoadingAsync(true);
            dbDaily.transaction(async (tx) => {
                const timeNow = getCurrentTime();
                tx.executeSql(
                    "UPDATE daily SET dailyGoal = ?, note = ?, updatedAt = ? WHERE uid = ?",
                    [dailyGoal, note, timeNow, uid],
                    () => {
                        if (isSync) {
                            setLastChangeDBDaily(timeNow);
                        }
                        submitAddDailyTask();
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
    return (
        <Modal
            visible={visible}
            animationType='fade'
            style={styles.modal}
            transparent={true}
            onRequestClose={() => {
                onClose();
            }}
        >
            {loadingAsync ?  <LoadingAsync /> : null}
            <View style={[styles.container, (isThemeDark ? styles.container_dark : {})]}>
                <MaterialIcon
                    name="cancel"
                    size={24}
                    color={isThemeDark ? '#fff' : '#737abd'}
                    onPress={() => {
                        onClose();
                    }}
                    style={styles.closeModal}
                />
                <Text style={[styles.dailyDateText, (isThemeDark ? styles.dailyDateText_dark : {})]}>
                    {moment(dailyDate).locale(language).format('dddd')}, {moment(dailyDate).locale(language).format('LL')}
                </Text>
                <Text style={[styles.taskName, (isThemeDark ? styles.taskName_dark : {})]}>
                    {task.name}
                </Text>
                <View style={[styles.taskGoal, (isThemeDark ? styles.taskGoal_dark : {})]}>
                    <Text style={[styles.goalText, (isThemeDark ? styles.goalText_dark : {})]}>
                        {task.goal}
                    </Text>
                     <Text style={[styles.unitText, (isThemeDark ? styles.unitText_dark : {})]}>
                         {task.unit}
                     </Text>
                </View>
                <Input
                    value={dailyGoal}
                    onChangeText={(text) => {
                        onChangeDailyTask('dailyGoal', text)
                    }}
                    placeholder={t('daily.goal')}
                    keyboardType="numeric"
                />
                <Input
                    value={note}
                    onChangeText={(text) => {
                        onChangeDailyTask('note', text)
                    }}
                    placeholder={t('daily.note')}
                    multiline={true}
                    style={styles.inputNote}
                />
                <BtnSave
                    onPress={()=>{
                        if (uid) {
                            updateDailyTask();
                        } else {
                            addDailyTask();
                        }
                    }}
                    text={t('daily.saveDaily')}
                />
            </View>
        </Modal>
    )
}

export default AddDailyTask;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 100,
        left: 10,
        right: 10,
        backgroundColor: '#e8ebfc',
        borderWidth: 1,
        borderColor: '#737abd',
        borderRadius: 5,
        padding: 10,
    },
    container_dark: {
        backgroundColor: '#646187',
        borderColor: '#fff',
    },
    closeModal: {
        position: 'absolute',
        right: 5,
        top: 5,
        zIndex: 10
    },
    dailyDateText: {
        color: '#737abd',
        fontWeight: '300',
    },
    dailyDateText_dark: {
        color: '#fff',
    },
    taskName: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    taskName_dark: {
        color: '#fff',
    },
    taskGoal: {
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    taskGoal_dark: {
        color: '#fff',
    },
    goalText: {
        color: '#373737',
    },
    goalText_dark: {
        color: '#fff',
    },
    unitText: {
        color: '#3f3f4a',
        paddingLeft: 5,
        fontSize: 12,
        fontWeight: '300'
    },
    unitText_dark: {
        color: '#fff',
    },
    inputNote: {
        height: 100,
    }
})
