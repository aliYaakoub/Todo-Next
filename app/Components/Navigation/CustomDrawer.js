import React from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import AppText from '../GeneralComponents/AppText';
import { MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'
import * as Clipboard from 'expo-clipboard';

import { useAuth } from '../../contexts/AuthContext';
import defaultStyles from '../../config/defaultStyles';

const CustomDrawer = (props) => {

    const { currentUser, logout } = useAuth()
    const navigation = useNavigation();

    async function handleLogout(){
        try{
            await logout();
            navigation.navigate('Login');
        }
        catch(err){
            Alert.alert('failed to logout.')
        }
    }

    const copyToClipboard = () => {
        Clipboard.setString(currentUser.id);
    };

    return (
        <View style={{flex: 1, backgroundColor: defaultStyles.colors.secondary}}>
            <DrawerContentScrollView {...props} >
                <View style={styles.header}>
                    <AppText style={styles.headerText}>{currentUser && currentUser.username}</AppText>
                </View>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>
            <View style={{paddingVertical: 20, borderTopWidth: 1, marginHorizontal: 15}}>
                <TouchableOpacity onPress={copyToClipboard}>
                    <View style={styles.logoutButton}>
                        <MaterialCommunityIcons name="content-copy" size={24} color="black" />
                        <AppText style={{marginLeft: 15}}>Click to copy your Id</AppText>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLogout}>
                    <View style={styles.logoutButton}>
                        <SimpleLineIcons name="logout" size={22} color="black" />
                        <AppText style={{marginLeft: 15}}>Logout</AppText>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default CustomDrawer

const styles = StyleSheet.create({
    logoutButton: {
        flexDirection: "row",
        // paddingHorizontal: 15,
        paddingBottom: 20,
        alignItems: 'center'
    },
    header: {
        paddingHorizontal: 15,
        paddingVertical: 20,
    },
    headerText: {
        textAlign: 'right'
    }
})
