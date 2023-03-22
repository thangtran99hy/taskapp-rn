import React, {useEffect, useState} from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {AppContext} from '../contexts/AppContext';
import {THEME_DARK} from '../utils/constants';
import {useContext} from 'react';
import {StyleSheet} from 'react-native';

const DeleteTaskIcon = (props) => {
    const {
        onDelete,
        task
    } = props;
    const {
        theme,
        dailyDate,
        dbDaily
    } = useContext(AppContext);
    const [isDelete, setIsDelete] = useState(false);

    useEffect(() => {
        getDailyByTask();
    }, [])

    const getDailyByTask = () => {
        try {
            dbDaily.transaction((tx) => {
                tx.executeSql(
                    "SELECT uid, goal, dailyGoal, note, task_uid, dailyDate, createdAt, updatedAt FROM daily WHERE (task_uid = ? AND dailyDate = ?) LIMIT 1",
                    [task.uid, dailyDate.format('MM/DD/YYYY')],
                    (tx, results) => {
                        if (results.rows.length === 0) {
                            setIsDelete(true);
                        }
                    }
                )
            })
        } catch (error) {

        }
    }

    const isThemeDark = theme === THEME_DARK;
    if (isDelete) {
        return (
            <IonIcon color={isThemeDark ? "#fff" : "#5d4bae"} name="remove-circle" style={styles.deleteIcon} size={30}
                     onPress={() => {
                         onDelete();
                     }}/>
        )
    }
    return null;
}

export default DeleteTaskIcon;

const styles = StyleSheet.create({
    deleteIcon: {
        position: 'absolute',
        right: 40,
        top: 10,
    },
})
