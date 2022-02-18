import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';

import Screen from '../GeneralComponents/Screen'
import defaultStyles from '../../config/defaultStyles'
import AppText from './../GeneralComponents/AppText';

const OfflineScreen = ({route}) => {

    // const [data, setData] = useState(null);

    // const storeData = async (key, value) => {  
    //     try {
    //         const jsonValue = JSON.stringify(value)
    //         await AsyncStorage.setItem(key, jsonValue)
    //     }
    //     catch (err) {
    //         console.error(err.message);
    //     }
    // }

    // const getData = async (key) => {
    //     try {
    //         const jsonValue = await AsyncStorage.getItem(key)
    //         return jsonValue != null ? JSON.parse(jsonValue) : null;
    //     }
    //     catch(err) {
    //         console.error(err.message);
    //     }
    // }

    // useEffect(()=>{
    //     const getItem = async () => {
    //         const AsyncData = await getData('todo-items');
    //         setData(AsyncData);
    //     }
    //     getItem();
    // }, [])

    // useEffect(()=>{
    //     const store = async () => {
    //         await storeData('todo-items', data)
    //     }
    //     store();
    // }, [data])

    // function handleCheckItem(){

    // }

    console.log(route);



    return (
        <Screen style={styles.screen}>
            {/* {data ? 
                data === null ? 
                    <AppText>you have no lists</AppText>
                    :
                    // data.map((item)=>(
                    //     <TouchableOpacity style={{flex: 1}} onPress={()=>handleCheckItem()}>
                    //         <AppText style={item.checked ? styles.checkedText : styles.text}>{item.title}</AppText>
                    //     </TouchableOpacity>
                    // ))
                    null
                :
                <AppText>Loading</AppText>
            } */}
        </Screen>
    )
}

export default OfflineScreen

const styles = StyleSheet.create({
    screen: {
        flex: 1, 
        backgroundColor: defaultStyles.colors.secondary,
        paddingHorizontal: 15,
    },
    text: {

    },
    checkedText: {
        opacity: 0.5,
        textDecorationLine: 'line-through',

    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10
    }
})
