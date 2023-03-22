import React, {useRef, useEffect, useContext, useState} from 'react';
import styled from 'styled-components/native';
import {Animated, Text, View} from 'react-native';
import {AppContext} from '../contexts/AppContext';
import {THEME_DARK} from '../utils/constants';

const CircleBase = styled(Animated.View)`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: ${props => props.size / 2}px;
  border-width: ${props => props.size / 10}px;
`;

const EmptyCircle = styled(CircleBase)`
  border-color: ${props => props.emptyColor};
  justify-content: center;
  align-items: center;
  transform: rotate(-45deg);
`;

const Indicator = styled(CircleBase)`
  position: absolute;
  border-left-color: ${props => props.color};
  border-top-color: ${props => props.color};
  border-right-color: transparent;
  border-bottom-color: transparent;
`;

const CoverIndicator = styled(CircleBase)`
  position: absolute;
  border-left-color: ${props => props.emptyColor};
  border-top-color: ${props => props.emptyColor};
  border-right-color: transparent;
  border-bottom-color: transparent;
`;

const viewColor = (percent) => {
    if (percent < 20) {
        return '#f94144'
    } else if (percent < 40) {
        return '#f3722c'
    } else if (percent < 60) {
        return '#ffd60a'
    } else if (percent < 80) {
        return '#C0EDA6'
    } else if (percent < 100) {
        return '#00C897'
    }
    return '#5463FF'
}


export default function CircularProgress({progress = 0, size = 50}: Props) {
    const {
        theme,
    } = useContext(AppContext);
    const isThemeDark = theme === THEME_DARK;
    const animatedProgress = useRef(new Animated.Value(0)).current;

    const animateProgress = useRef(toValue => {
        Animated.spring(animatedProgress, {
            toValue,
            useNativeDriver: true,
        }).start();
    }).current;

    useEffect(() => {
        animateProgress(progress);
    }, [animateProgress, progress]);

    const firstIndicatorRotate = animatedProgress.interpolate({
        inputRange: [0, 50],
        outputRange: ['0deg', '180deg'],
        extrapolate: 'clamp',
    });

    const secondIndicatorRotate = animatedProgress.interpolate({
        inputRange: [0, 100],
        outputRange: ['0deg', '360deg'],
        extrapolate: 'clamp',
    });

    const secondIndictorVisibility = animatedProgress.interpolate({
        inputRange: [0, 49, 50, 100],
        outputRange: [0, 0, 1, 1],
        extrapolate: 'clamp',
    });

    return (
        <EmptyCircle
            size={size}
            color={viewColor(progress)}
            emptyColor={isThemeDark ? '#e6edfc' :'#fff'}
        >
            <Indicator
                style={{transform: [{rotate: firstIndicatorRotate}]}}
                size={size}
                color={viewColor(progress)}
                emptyColor={isThemeDark ? '#e6edfc' :'#fff'}
            />
            <CoverIndicator
                size={size}
                color={viewColor(progress)}
                emptyColor={isThemeDark ? '#e6edfc' :'#fff'}
            />
            <Text
                style={{
                    color: viewColor(progress),
                    fontWeight: 'bold',
                }}
            >
                {Number(progress).toFixed(0)}%
            </Text>
            <Indicator
                size={size}
                style={{
                    transform: [{rotate: secondIndicatorRotate}],
                    opacity: secondIndictorVisibility,
                }}
                color={viewColor(progress)}
                emptyColor={isThemeDark ? '#e6edfc' :'#fff'}
            />
        </EmptyCircle>
    );
}
