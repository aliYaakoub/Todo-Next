import React from 'react'
import { StyleSheet, View } from 'react-native'
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';

const Screen = ({children, style, statusBar}) => {
    return (
        <View style={[styles.container, style]}>
            {children}
            <StatusBar style={statusBar} />
        </View>
    )
}

export default Screen

const styles = StyleSheet.create({
    container: {
        paddingTop: Constants.statusBarHeight,
        flex: 1
    }
})
