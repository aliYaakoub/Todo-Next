import React from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import defaultStyles from '../../config/defaultStyles'

const AppTextInput = ({ containerStyle, icon, name, style, ...otherProps }) => {
    return (
        <View style={[styles.container, containerStyle]}>
            <TextInput 
                name={name} 
                placeholderTextColor={'#999'} 
                style={[defaultStyles.text, style, {flex: 1}]} 
                {...otherProps} 
            />
            {icon && 
                <MaterialCommunityIcons 
                    name={icon} 
                    size={20} 
                    color={defaultStyles.colors.medium} 
                    style={styles.icon} 
                />
            }
        </View>
    )
}

export default AppTextInput

const styles = StyleSheet.create({
    container: {
        backgroundColor: defaultStyles.colors.text.primary,
        borderRadius: 25,
        flexDirection: 'row',
        width: '100%',
        padding: 15,
        marginVertical: 10,
        alignItems: 'center'
    },
    icon: {
        marginRight: 10
    }
})
