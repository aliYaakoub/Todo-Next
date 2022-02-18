import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Feather } from '@expo/vector-icons';

import defaultStyles from '../../config/defaultStyles';
import AppTextInput from './../GeneralComponents/AppTextInput';
import AppText from '../GeneralComponents/AppText';
import AppButton from '../GeneralComponents/AppButton';
import { useAuth } from './../../contexts/AuthContext';

const CreateNewListItem = ({setModalVisible, listId}) => {

    const [title, setTitle] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [loading, setLoading] = useState(false)

    const { addTodoItem } = useAuth();

    async function handleSubmit(){
        setErrMsg('')
        if(title === ''){
            return setErrMsg('please enter a title.')
        }
        else if(title.length > 50){
            return setErrMsg('title is too long, keep it short and sweet.')
        }
        setLoading(true)
        try{
            await addTodoItem(listId, title)
            setTitle('')
            // setModalVisible(false)
        }
        catch(err){
            console.error(err.message);
            setErrMsg('an error occured, please try again later.')
        }
        setLoading(false)
    }

    return (
        <View style={styles.container}>
            <Feather
                name="x"
                size={30}
                color={defaultStyles.colors.text.primary}
                style={styles.exitIcon}
                onPress={()=>setModalVisible(false)}
            />
            {errMsg ? <AppText style={{paddingTop: 15, color: 'red'}}>{errMsg}</AppText> : null}
            <AppTextInput 
                name={'title'}
                value={title}
                onChangeText={(val)=>setTitle(val)}
                containerStyle={[styles.containerStyle, errMsg && {borderBottomColor: 'red'}]}
                placeholder='Title'
            />
            <AppButton 
                title={'Add item'}
                style={styles.button}
                textStyle={{color: 'white'}}
                onPress={()=>handleSubmit()}
                disabled={loading}
            />
        </View>
    )
}

export default CreateNewListItem

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: defaultStyles.colors.secondary,
        position: 'relative',
        padding: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    exitIcon: {
        position: 'absolute',
        top: 10,
        right: 10
    },
    containerStyle: {
      borderRadius: 0,
      borderBottomWidth: 1.5,
      backgroundColor: null,
      borderBottomColor: defaultStyles.colors.text.primary,
      marginVertical: 25
    },
    button: {
        backgroundColor: defaultStyles.colors.primary,
        elevation: 20,
        marginVertical: 25
    }
})
