import React, { useEffect } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { Ionicons, FontAwesome5 } from '@expo/vector-icons'

import HomeScreen from '../Screens/HomeScreen';
import OfflineScreen from '../Screens/OfflineScreen';
import ConnectsScreen from '../Screens/ConnectsScreen';
import SettingScreen from '../Screens/SettingScreen';
import defaultStyles from '../../config/defaultStyles';
import CustomDrawer from './CustomDrawer'
import { useAuth } from '../../contexts/AuthContext';
import AppText from '../GeneralComponents/AppText';
import Screen from '../GeneralComponents/Screen';
import EditListScreen from '../Screens/EditListScreen';
import LoadingScreen from '../AppComponents/LoadingScreen';

const Drawer = createDrawerNavigator();

const DrawerScreen = () => {

    const { currentUser } = useAuth();

    return (            
        <>
            {currentUser ? 
                <Drawer.Navigator
                    drawerContent={props => <CustomDrawer {...props} />}
                    initialRouteName='Home'
                    screenOptions={{
                        // headerShown: false,
                        headerStyle: {
                            backgroundColor: defaultStyles.colors.secondary,
                        },
                        headerTintColor: defaultStyles.colors.text.primary,
                        drawerActiveBackgroundColor: defaultStyles.colors.primary,
                        drawerActiveTintColor: '#fff',
                        drawerInactiveTintColor: '#333',
                        drawerLabelStyle: {
                            marginLeft: -25,
                            fontSize: 15,
                        },
                    }}
                >
                    <Drawer.Screen
                        name="Home"
                        component={HomeScreen}
                        options={{
                            drawerIcon: ({color}) => (
                            <Ionicons name="home-outline" size={22} color={color} />
                            ),
                        }}
                    />
                    {/* <Drawer.Screen
                        name="EditList"
                        component={EditListScreen}
                        options={{
                            drawerIcon: ({color}) => (
                            <FontAwesome5 name="tasks" size={22} color={color} />
                            ),
                        }}
                    /> */}
                    <Drawer.Screen
                        name="Connects"
                        component={ConnectsScreen}
                        options={{
                            drawerIcon: ({color}) => (
                            <Ionicons name="person-outline" size={22} color={color} />
                            ),
                        }}
                    />
                    <Drawer.Screen
                        name="Setting"
                        component={SettingScreen}
                        options={{
                            drawerIcon: ({color}) => (
                            <Ionicons name="settings-outline" size={22} color={color} />
                            ),
                        }}
                    />
                </Drawer.Navigator>
                :
                <LoadingScreen />
            }
        </>
    )
}

export default DrawerScreen

const styles = StyleSheet.create({})
