import {ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AddDailyTask from './AddDailyTask';
import {AppContext} from '../contexts/AppContext';
import moment from 'moment';
import {THEME_DARK} from '../utils/constants';
import CircularProgress from './CircularProgress';


const TaskDaily = (props) => {
    const {
        task
    } = props;
    const {
        theme,
        dailyDate,
        dbDaily,
        setViewImageModal
    } = useContext(AppContext);
    const [dailyTask, setDailyTask] = useState(null);

    useEffect(() => {
        getTaskDaily();
    }, [])

    useEffect(() => {
        getTaskDaily();
    }, [dailyDate])

    const getTaskDaily = () => {
        try {
            dbDaily.transaction((tx) => {
                tx.executeSql(
                    "SELECT uid, goal, dailyGoal, note, task_uid, dailyDate, createdAt, updatedAt FROM daily WHERE (task_uid = ? AND dailyDate = ?)",
                    [task.uid, dailyDate.format('MM/DD/YYYY')],
                    (tx, results) => {
                        if (results.rows.length > 0) {
                            setDailyTask(results.rows.item(0))
                        } else {
                            setDailyTask(null);
                        }
                    }
                )
            })
        } catch (error) {

        }
    }
    const [visibleModal, setVisibleModal] = useState(false);
    const isThemeDark = theme === THEME_DARK;

    return (
        <View style={[styles.container, (isThemeDark ? styles.container_dark : {})]}>
            <View style={styles.header}>
                <Text style={[styles.taskLabelText, (isThemeDark ? styles.taskLabelText_dark : {})]}>
                    {task.name}
                </Text>
            </View>
            <FlatList
                data={task.images}
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
                                    height: 36,
                                    width: 36
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
                    {task.goal}
                </Text>
                <Text style={[styles.unitText, (isThemeDark ? styles.unitText_dark : {})]}>
                    {task.unit}
                </Text>
            </View>
            <View style={styles.bottom}>
                <View style={styles.activeGoal}>
                    <View style={styles.activeGoalData}>
                        <Text style={[styles.activeGoalText, (isThemeDark ? styles.activeGoalText_dark : {})]}>
                            {dailyTask?.dailyGoal ?? ""}
                        </Text>
                        <IonIcon
                            name="eyedrop"
                            color={isThemeDark ? "#fff" : "#5d4bae"}
                            size={24}
                            onPress={() => {
                                setVisibleModal(true);
                            }}
                        />
                    </View>
                    {dailyTask?.note ? <Text style={[styles.noteText, (isThemeDark ? styles.noteText_dark : {})]}>
                            {dailyTask.note}
                    </Text> : null}
                    {dailyTask?.updatedAt ? <View style={styles.updatedAt}>
                        <Text style={[styles.updatedAtText, (isThemeDark ? styles.updatedAtText_dark : {})]}>
                            {moment(dailyTask.updatedAt).format('llll')}
                        </Text>
                    </View> : null }
                </View>

                <View>
                    {(dailyTask?.dailyGoal && task.goal) ? <>
                        <CircularProgress
                            progress={(dailyTask.dailyGoal/task.goal)*100}
                            size={60}
                        />
                    </> : null}
                </View>
            </View>
            {visibleModal && <AddDailyTask
                visible={visibleModal}
                task={task}
                onClose={() => {
                    setVisibleModal(false)
                }}
                submitAddDailyTask={() => {
                    getTaskDaily();
                }}
                dataInitial={dailyTask}
            />}
        </View>
    )
}

export default TaskDaily;

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#eaf1fb',
        marginVertical: 5,
        borderRadius: 5,
    },
    container_dark: {
        // backgroundColor: '#b9b6ca',
        backgroundColor: '#4e4a6e',
    },
    header: {
        marginBottom: 10,
    },
    taskLabelText: {
        fontSize: 16,
        color: '#363636',
        fontWeight: '600'
    },
    taskLabelText_dark: {
        color: '#FDF6EC'
    },
    targetAndUnit: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
    },
    targetText: {
        // fontWeight: '600',
        fontSize: 18
    },
    targetText_dark: {
        color: '#fff'
    },
    unitText: {
        // fontWeight: 'bold'
    },
    unitText_dark: {
        color: '#9d9ba7',
    },
    bottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    activeGoal: {
        flex: 1,
    },
    activeGoalData: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    activeGoalText: {
        fontWeight: 'bold',
        fontSize: 36,
        paddingRight: 5,
    },
    activeGoalText_dark: {
        color: '#EEEEEE'
    },
    imageContainer: {
        padding: 5,
    },
    percentText: {
        fontWeight: '600'
    },
    updatedAt: {

    },
    updatedAtText: {
        color: '#5a5a5a',
        fontSize: 12
    },
    updatedAtText_dark: {
        color: '#d3cfe2',
    },
    noteText: {
        color: '#5a5a5a',
        fontSize: 15,
        paddingLeft: 10,
        marginBottom: 20
    },
    noteText_dark: {
        color: '#d3cfe2',
    }
})
