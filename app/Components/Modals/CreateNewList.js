import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Feather } from '@expo/vector-icons';

import defaultStyles from '../../config/defaultStyles';
import AppTextInput from './../GeneralComponents/AppTextInput';
import AppText from '../GeneralComponents/AppText';
import AppButton from '../GeneralComponents/AppButton';
import { useAuth } from './../../contexts/AuthContext';

const CreateNewList = ({setModalVisible}) => {

    const [name, setName] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [loading, setLoading] = useState(false)

    const { currentUser, createList } = useAuth();

    async function handleSubmit(){
        setErrMsg('')
        if(name === ''){
            return setErrMsg('please enter a name.')
        }
        else if(name.length > 25){
            return setErrMsg('name is too long, keep it short and sweet.')
        }
        try{
            setLoading(true)
            await createList(name, currentUser.id)
            // setName('')
            setModalVisible(false)
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
            <AppText>Enter a name for your list : </AppText>
            {errMsg ? <AppText style={{paddingTop: 15, color: 'red'}}>{errMsg}</AppText> : null}
            <AppTextInput 
                name={'name'}
                value={name}
                onChangeText={(val)=>setName(val)}
                containerStyle={[styles.containerStyle, errMsg && {borderBottomColor: 'red'}]}
                placeholder='Name'
            />
            <AppButton 
                title={'Create List'}
                style={styles.button}
                textStyle={{color: 'white'}}
                onPress={()=>handleSubmit()}
                disabled={loading}
            />
        </View>
    )
}

export default CreateNewList

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
