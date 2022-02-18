import React, { useState } from 'react'
import { FlatList, Modal, StyleSheet, TouchableOpacity, View, Image } from 'react-native'
import { MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';

import { useAuth } from '../../contexts/AuthContext'
import AppText from './../GeneralComponents/AppText';
import ConnectCard from './ConnectCard';
import SendConnectRequest from '../Modals/SendConnectRequest';
import defaultStyles from '../../config/defaultStyles';

const UserConnects = () => {

    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const { currentUser, setChanges, unConnectUser } = useAuth();

    async function removeUser(id){
        await unConnectUser(currentUser.id, id)
        setChanges(old => old + 1);
    }

    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity onPress={()=>setModalVisible(!modalVisible)}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <MaterialIcons name="person-add" size={24} color={defaultStyles.colors.primary} style={{paddingHorizontal: 15}} />
                    <AppText style={styles.text} >Send a connect Requests</AppText>
                </View>
            </TouchableOpacity>
            {currentUser && 
                currentUser.connects.length === 0 ? 
                    <View style={{flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                        <Image style={{width: '70%', height: '100%'}} source={require('../../../assets/connects-bg.png')} />
                    </View>
                    :
                    <>
                        <AppText style={styles.text}>Your Connects : </AppText>
                        <FlatList
                            data={currentUser.connects}
                            renderItem={({item})=>(
                                <ConnectCard data={item} disabled={loading} onPress={()=>removeUser(item)} title={'remove'} />
                            )}
                        />
                    </>
            }
            <View style={{width: '100%', justifyContent: 'center', alignItems: 'center', paddingVertical: 10}}>
                <TouchableOpacity onPress={()=>setChanges(old => old + 1)} >
                    <SimpleLineIcons name="reload" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <Modal
               onRequestClose={()=>setModalVisible(!modalVisible)} 
               visible={modalVisible}
               animationType='slide'
            >
                <SendConnectRequest setModalVisible={setModalVisible} />
            </Modal>
        </View>
    )
}

export default UserConnects

const styles = StyleSheet.create({
    text: {
        textAlign: 'center', 
        paddingVertical: 15,
        fontWeight: 'bold'
    }
})
