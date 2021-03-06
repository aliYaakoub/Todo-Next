import React from 'react'
import { StyleSheet, View } from 'react-native'
import colors from '../../config/colors'

const ListItemsSeperator = () => {
    return (
        <View style={styles.seperator} />
    )
}

export default ListItemsSeperator

const styles = StyleSheet.create({
    seperator: {
        width: '100%', 
        height: 1, 
        backgroundColor: colors.primary
    }
})
