import React, { useState } from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'
import defaultStyles from '../../config/defaultStyles'
import AppButton from '../GeneralComponents/AppButton'
import AppText from '../GeneralComponents/AppText'
import { useAuth } from '../../contexts/AuthContext'

const SendRequestCard = ({data}) => {

    const [loading, setLoading] = useState(false);

    const { currentUser, sendConnectRequest } = useAuth();

    async function handleSendRequest(){
        setLoading(true)
        try{
            if(currentUser.id === data.id){
                return Alert.alert('you can\'t send a connect request to yourself.')
            }
            else if(currentUser.connects.includes(data.id)){
                return Alert.alert('you already have connected with this user.')
            }
            await sendConnectRequest(currentUser.id, data.id);
        }
        catch(err){
            console.error(err.message);
            Alert.alert('an error occured, please try again later.')
        }
        setLoading(false)
    }

    return (
        <View style={styles.card}>
            <AppText>{data.username}</AppText>
            <AppButton 
                title={'send request'}
                style={styles.button}
                textStyle={{color: 'white'}}
                onPress={()=>handleSendRequest()}
                disabled={loading}
            />
        </View>
    )
}

export default SendRequestCard

const styles = StyleSheet.create({
    card: {
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: defaultStyles.colors.primary,
        width: '50%',
        padding: 8,
        elevation: 20
    }
})
