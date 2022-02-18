import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useAuth } from '../../contexts/AuthContext'
import useFirestoreBySearch from '../../firebase/useFireStoreBySearch'
import AppText from '../GeneralComponents/AppText';
import LoadingScreen from './LoadingScreen';
import RequestCard from './RequestCard';

const ConnectRequests = () => {

    const { currentUser } = useAuth();
    const { docs, loading } = useFirestoreBySearch('connect-requests', currentUser.id, 'receiver', '==');

    return (
        <>
            {loading ?
                <LoadingScreen />
                :
                <View style={{flex: 1}}>
                    {docs.length === 0 ?
                        <AppText style={{textAlign: 'center', paddingVertical: 10}}>No requests</AppText>
                        :
                        docs.map((req)=>(
                            <RequestCard req={req} />
                        ))
                    }
                </View>
            }
        </>
    )
}

export default ConnectRequests

const styles = StyleSheet.create({})
