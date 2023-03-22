import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Group from './src/screens/group';
import Task from './src/screens/task';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Daily from './src/screens/daily';
import SQLite from 'react-native-sqlite-storage';
import AppContextProvider from './src/contexts/AppContext';
import IconSwitchTheme from './src/components/IconSwitchTheme';
import NavContainer from './src/navigation/NavContainer';
import SwitchLanguageIcon from './src/components/SwitchLanguageIcon';
import LoadingAsync from './src/components/LoadingAsync';


const App = (props) => {
    return (
        <View style={styles.container}>
            <AppContextProvider>
                <NavContainer />
                <IconSwitchTheme />
                <SwitchLanguageIcon />
                <LoadingAsync />
            </AppContextProvider>
        </View>
    )
}

export default App;

const styles = StyleSheet.create({
    container: {
        height: '100%'
    },
})
