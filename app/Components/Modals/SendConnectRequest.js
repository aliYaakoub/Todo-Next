import React, { useState } from 'react'
import { FlatList, StyleSheet, Text, View, Alert } from 'react-native'
import { Feather, AntDesign } from '@expo/vector-icons';

import defaultStyles from '../../config/defaultStyles'
import AppTextInput from '../GeneralComponents/AppTextInput';
import AppText from '../GeneralComponents/AppText';
import useFirestore from '../../firebase/useFirestore';
import SendRequestCard from '../AppComponents/SendRequestCard';
import AppButton from '../GeneralComponents/AppButton';
import { useAuth } from '../../contexts/AuthContext';

const SendConnectRequest = ({setModalVisible}) => {

    const [connectId, setConnectId] = useState('');
    const [loading, setLoading] = useState(false)

    const { docs: users } = useFirestore('users', 'asc');
    const { currentUser, sendConnectRequest } = useAuth();

    async function handleSendRequest(){
        if(connectId === ''){
            return Alert.alert('please enter a connect Id')
        }
        setLoading(true)
        try{
            if(currentUser.id === connectId){
                setConnectId('')
                return Alert.alert('you can\'t send a connect request to yourself.')
            }
            else if(currentUser.connects.includes(connectId)){
                setConnectId('')
                return Alert.alert('you already have connected with this user.')
            }
            await sendConnectRequest(currentUser.id, connectId);
            setConnectId('')
        }
        catch(err){
            console.error(err.message);
            Alert.alert('an error occured, please try again later.')
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
            <AppText style={{textAlign: 'center', paddingVertical: 10}}>Enter the user's connectId to send a request: </AppText>
            <AppTextInput 
                name={'connectId'}
                value={connectId}
                onChangeText={(val)=>setConnectId(val)}
                icon={'account-box'}
                containerStyle={styles.containerStyle}
                placeholder='Connect Id'
            />
            <AppButton 
                title={'send request'}
                style={styles.button}
                textStyle={{color: 'white'}}
                onPress={()=>handleSendRequest()}
                disabled={loading}
            />
            <AppText style={{textAlign: 'center', paddingVertical: 30}}>Or send a request directly</AppText>
            <FlatList
                key={(item)=>item.id}
                data={users.filter((user)=>{
                    return user.id !== currentUser.id 
                    // || 
                }).filter((user)=>{
                    return !(currentUser.connects.includes(user.id))
                })}
                renderItem={({item})=>(
                    <SendRequestCard data={item} />
                )}
            />
        </View>
    )
}

export default SendConnectRequest

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: defaultStyles.colors.secondary,
        position: 'relative',
        padding: 25
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
      borderBottomColor: defaultStyles.colors.text.primary
    },
    button: {
        backgroundColor: defaultStyles.colors.primary,
        elevation: 20
    }
})
