import React, { useState, useEffect} from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native';
import defaultStyles from '../../config/defaultStyles';

import { useAuth } from '../../contexts/AuthContext'
import AppButton from '../GeneralComponents/AppButton';
import AppText from '../GeneralComponents/AppText';

const RequestCard = ({req}) => {

    const [user, setUser] = useState('');
    const [loading, setLoading] = useState(false)

    const { getUserData, acceptConnectRequest, setChanges, deleteconnectRequest } = useAuth();

    useEffect(() => {
        const getUser = async () => {
            const userToGet = await getUserData(req.sender);
            setUser(userToGet.data());
        }
        getUser();
    }, [getUserData, req.sender])

    async function handleAccept(){
        setLoading(true)
        try{
            await acceptConnectRequest(req.id);
            setChanges(old=>old+1)
        }
        catch(err){
            console.error(err.message);
            Alert.alert('An error occured, please try again later.')
        }
        setLoading(false)
    }
    async function handleDecline(){
        setLoading(true)
        try{
            await deleteconnectRequest(req.id);
            setChanges(old=>old+1)
        }
        catch(err){
            console.error(err.message);
            Alert.alert('An error occured, please try again later.')
        }
        setLoading(false)
    }

    return (
        <>
            {user ?
                <View style={styles.card}>
                    <AppText style={{textAlign: 'center', padding: 10}}>
                        <Text style={{fontWeight: 'bold'}}>{user.username} </Text>
                        <Text>wants to connect.</Text>
                    </AppText>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <AppButton
                            title={'Accept'}
                            onPress={()=>handleAccept()}
                            style={{backgroundColor: defaultStyles.colors.primary, width: '48%'}}
                            textStyle={{color: 'white'}}
                            disabled={loading}
                        />
                        <AppButton
                            title={'decline'}
                            onPress={()=>handleDecline()}
                            style={{backgroundColor: defaultStyles.colors.danger, width: '48%'}}
                            textStyle={{color: 'white'}}
                            disabled={loading}
                        />
                    </View>
                </View>
                :
                null
            }
        </>
    );
}

export default RequestCard

const styles = StyleSheet.create({
    card: {
        padding: 15,
    }
})