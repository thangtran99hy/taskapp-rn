import React, {useContext} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {AppContext} from '../contexts/AppContext';

const LoadingAsync = (props) => {
    const {
        loadingAsync,
    } = useContext(AppContext);
    if (loadingAsync) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#bed5f9" />
            </View>
        )
    }
    return null;
}

export default LoadingAsync;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        zIndex: 2000,
        elevation: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    container_dark: {
        // backgroundColor: '#646187'
    }
})
