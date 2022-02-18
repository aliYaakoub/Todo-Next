import React from 'react'
import { StyleSheet, TouchableHighlight } from 'react-native'
import AppText from './AppText'

const AppButton = ({title, onPress, style, textStyle, disabled=false}) => {
    return (
        <TouchableHighlight style={[styles.button, style]} onPress={onPress} disabled={disabled}>
            <AppText style={textStyle}>{title}</AppText>
        </TouchableHighlight>
    )
}

export default AppButton

const styles = StyleSheet.create({
    button: {
        width: '100%',
        padding: 15,
        marginVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
