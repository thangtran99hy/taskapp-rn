import React, {useContext, useState} from 'react';
import {
    ActivityIndicator,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    View,
} from 'react-native';
import {AppContext} from '../contexts/AppContext';
import {THEME_DARK} from '../utils/constants';
import moment from 'moment';
import IonIcon from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-date-picker';
import TaskDaily from '../components/TaskDaily';
import DailyNote from '../components/DailyNote';

const Daily = (props) => {
    const {
        dailyDate,
        theme,
        setDailyDate,
        setTheme,
        groups,
        getGroups,
        dbGroup,
        tasks,
        loadingDataDaily,
        language
    } = useContext(AppContext);
    const [openDatePicker, setOpenDatePicker] = useState(false)
    const isThemeDark = theme === THEME_DARK;
    const [collapseUid, setCollapseUid] = useState((Array.isArray(groups) && groups.length > 0) ? groups[0].uid : null);
    return (
        <View style={[styles.container, (isThemeDark ? styles.container_dark : {})]}>
            {loadingDataDaily ? <View style={styles.loadingDailyContainer}>
                <ActivityIndicator size="large" color="#bed5f9" />
            </View> : null}
            <View style={styles.header}>
                <IonIcon
                    name="arrow-back"
                    size={30}
                    color={isThemeDark ? "#fff" : "#5d4bae"}
                    onPress={() => {
                        setDailyDate(moment(dailyDate).subtract(1, 'days'))
                    }}
                />
                <TouchableOpacity style={styles.viewDate} onPress={() => {
                    setOpenDatePicker(true);
                }}>
                    <Text style={[styles.viewDateYear, (isThemeDark ? styles.viewDateYear_dark : {})]}>
                        {moment(dailyDate).locale(language).format('YYYY')}
                    </Text>
                    <Text style={[styles.viewDateMonth, (isThemeDark ? styles.viewDateMonth_dark : {})]}>
                        {moment(dailyDate).locale(language).format('MMMM')}
                    </Text>
                    <Text style={[styles.viewDateDay, (isThemeDark ? styles.viewDateDay_dark : {})]}>
                        {moment(dailyDate).locale(language).date()}
                    </Text>
                </TouchableOpacity>
                <IonIcon
                    name="arrow-forward"
                    size={30}
                    color={isThemeDark ? "#fff" : "#5d4bae"}
                    onPress={() => {
                        setDailyDate(moment(dailyDate).add(1, 'days'))
                    }}
                />
            </View>
            <DailyNote />
            <ScrollView>
                {
                    groups.map((itemGroup, indexGroup) => {
                        const tasksByGroups = tasks.filter(itemTask => itemTask.group_uid === itemGroup.uid)
                        return (
                            <View style={[styles.groupContainer, (isThemeDark ? styles.groupContainer_dark : {})]} key={indexGroup}>
                                <TouchableOpacity style={styles.groupLabel}
                                                  onPress={() => {
                                                      if (collapseUid === itemGroup.uid) {
                                                          setCollapseUid(null);
                                                      } else {
                                                          setCollapseUid(itemGroup.uid);
                                                      }
                                                  }}
                                >
                                    <Text style={[styles.groupLabelText, (isThemeDark ? styles.groupLabelText_dark : {})]}>{itemGroup.name}</Text>
                                </TouchableOpacity>
                                <View style={[styles.listTask, (collapseUid === itemGroup.uid ? styles.listTask_isCollapse: {})]}>
                                    {
                                        tasksByGroups.map((itemTask, indexTask) => {
                                            return (
                                                <TaskDaily
                                                    task={itemTask}
                                                    key={indexTask}
                                                />
                                            )
                                        })
                                    }
                                </View>
                            </View>
                        )
                    })
                }
            </ScrollView>
            <DatePicker
                modal
                mode="date"
                open={openDatePicker}
                date={new Date(dailyDate)}
                onConfirm={(date) => {
                    // console.log(date)
                    setOpenDatePicker(false)
                    setDailyDate(moment(date))
                }}
                onCancel={() => {
                    setOpenDatePicker(false)
                }}
            />
        </View>
    )
}

export default Daily;

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
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewDate: {
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewDateYear: {
        fontSize: 15
    },
    viewDateYear_dark: {
        color: "#fff"
    },
    viewDateMonth: {
        fontSize: 18,
        color: '#373737',
        fontWeight: '600'
    },
    viewDateMonth_dark: {
        color: "#fff"
    },
    viewDateDay: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    viewDateDay_dark: {
        color: "#fff"
    },
    groupContainer: {
        backgroundColor: '#fff',
        marginVertical: 5,
        borderRadius: 5,
    },
    groupContainer_dark: {
        backgroundColor: '#7a789a',
    },
    groupLabel: {
        // backgroundColor: '#f4f6fc',
        padding: 10,
    },
    groupLabelText: {
        fontWeight: 'bold',
    },
    groupLabelText_dark: {
        color: '#fff'
    },
    listTask: {
        padding: 0,
        // paddingLeft: 10,
        height: 0,
        opacity: 0,
    },
    listTask_isCollapse: {
        padding: 10,
        height: 'auto',
        opacity: 1,
    },
    taskContainer: {

    },
    loadingDailyContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 80,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        zIndex: 1000,
        elevation: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
})
