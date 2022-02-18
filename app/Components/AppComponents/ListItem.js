import React, { useState } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Feather } from '@expo/vector-icons';

import AppText from '../GeneralComponents/AppText'
import { useAuth } from './../../contexts/AuthContext';
import defaultStyles from '../../config/defaultStyles';

const ListItem = ({data}) => {

    const [deleteLoading, setDeleteLoading] = useState(false);

    const { checkItem, deleteTodoItem } = useAuth();

    async function handleCheckItem(){
        try{
            await checkItem(data.id);
        }
        catch(err){
            console.error(err.message);
            Alert.alert('an error occured, please try again later.')
        }
    }

    async function handleDeleteItem(){
        if(deleteLoading){
            return
        }
        setDeleteLoading(true);
        try{
            await deleteTodoItem(data.list, data.id);
        }
        catch(err){
            console.error(err.message);
            Alert.alert('an error occured, please try again later.');
        }
        setDeleteLoading(false);
    }

    return (
        <View style={styles.item}>
            <Feather 
                name={data.checked ? 'check-circle' : "circle" }
                size={20} 
                color={defaultStyles.colors.text.primary}
                style={{paddingRight: 15}} 
                onPress={()=>handleCheckItem()}
            />
            <TouchableOpacity style={{flex: 1}} onPress={()=>handleCheckItem()}>
                <AppText style={data.checked ? styles.checkedText : styles.text}>{data.title}</AppText>
            </TouchableOpacity>
            <Feather
                name="x"
                size={20}
                color={defaultStyles.colors.text.primary}
                onPress={()=>handleDeleteItem()}
            />
        </View>
    )
}

export default ListItem

const styles = StyleSheet.create({
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
