import React, {useContext} from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Group from '../screens/group';
import Task from '../screens/task';
import Daily from '../screens/daily';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {AppContext} from '../contexts/AppContext';
import {ROUTE_DAILY, ROUTE_GROUP, ROUTE_PROFILE, ROUTE_TASK, THEME_DARK} from '../utils/constants';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import ViewImage from '../components/ViewImage';
import Login from '../screens/login';
import Profile from '../screens/profile';
import {useTranslation} from 'react-i18next';
import AsyncData from '../components/AsyncData';
import UserData from '../components/UserData';
const Tab = createBottomTabNavigator();

const NavContainer = (props) => {
    const {
        theme,
        loadingTheme,
        loadingUser,
        loadingLanguage,
        user,
        viewAsyncData,
        isConnected
    } = useContext(AppContext);
    const { t, i18n } = useTranslation();
    const isThemeDark = theme === THEME_DARK;

    if (!loadingTheme || !loadingUser || !loadingLanguage) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#bed5f9" />
            </View>
        )
    }
    if (!user) {
        return (
            <Login

            />
        )
    }
    const userType = user.userType;
    return (
        <>
            <NavigationContainer>
                <Tab.Navigator
                    screenOptions={({route}) => ({
                        headerShown: false,
                        tabBarIcon: ({focused, color, size}) => {
                            let iconTab;
                            switch (route?.name) {
                                case ROUTE_GROUP:
                                    iconTab = focused ? 'albums' : 'albums-outline';
                                    break;
                                case ROUTE_TASK:
                                    iconTab = focused ? 'eyedrop' : 'eyedrop-outline';
                                    break;
                                case ROUTE_DAILY:
                                    iconTab = focused ? 'checkbox' : 'checkbox-outline';
                                    break;
                                case ROUTE_PROFILE:
                                    iconTab = focused ? 'person-circle' : 'person-circle-outline';
                                    break;
                            }
                            return <IonIcon name={iconTab} size={size} color={isThemeDark ? '#fff' : '#646187'} />;
                        },
                        tabBarLabel: (({focused, color}) => {
                            let labelName;
                            switch (route?.name) {
                                case ROUTE_GROUP:
                                    labelName = t('tabBar.group');
                                    break;
                                case ROUTE_TASK:
                                    labelName = t('tabBar.task');
                                    break;
                                case ROUTE_DAILY:
                                    labelName = t('tabBar.daily');
                                    break;
                                case ROUTE_PROFILE:
                                    labelName = t('tabBar.profile');
                                    break;
                            }
                            return <Text style={[styles.tabBarLabel, (isThemeDark ? styles.tabBarLabel_dark : {}), (focused ? styles.tabBarLabel_active : {})]}>{labelName}</Text>
                        }),
                        tabBarActiveTintColor: isThemeDark ? '#fff' : '#646187',
                        tabBarInactiveTintColor: isThemeDark ? '#fff' : '#646187',
                        tabBarActiveBackgroundColor: 'transparent',
                        tabBarInactiveBackgroundColor: 'transparent',
                        tabBarStyle: {
                            position: 'absolute',
                            elevation: 8,
                            borderTopWidth: 0,
                            shadowRadius: 0,
                            shadowColor: 'transparent',
                            bottom: 10,
                            right: 10,
                            left: 10,
                            boxShadow: null,
                            backgroundColor: isThemeDark ? '#4e4a6e' : '#fff',
                            height: 60
                        },
                        tabBarItemStyle: {
                            padding: 5,
                        },
                        tabBarHideOnKeyboard: true
                    })}
                >
                    <Tab.Screen name="Group" component={Group} />
                    <Tab.Screen name="Task" component={Task} />
                    <Tab.Screen name="Daily" component={Daily} />
                    <Tab.Screen name="Profile" component={Profile} />
                </Tab.Navigator>
            </NavigationContainer>
            <ViewImage />
            {viewAsyncData && <AsyncData />}
            {isConnected && <UserData />}
        </>
    )
}

export default NavContainer;

const styles = StyleSheet.create({
    loadingContainer: {
        height: '100%',
        backgroundColor: '#e6edfc',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
        elevation: 999
    },
    tabBarLabel: {
        color: '#646187',
        textTransform: 'uppercase',
        fontSize: 12,
    },
    tabBarLabel_active: {
        fontWeight: 'bold',
        fontSize: 14
    },
    tabBarLabel_dark: {
        color: '#fff'
    }
})
