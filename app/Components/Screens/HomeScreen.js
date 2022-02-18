import React, { useState } from 'react'
import { FlatList, StyleSheet, TouchableOpacity, View, Modal, Text, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { AdMobBanner, PublisherBanner } from 'expo-ads-admob'
import Constants from 'expo-constants';

import defaultStyles from '../../config/defaultStyles'
import useFirestoreBySearch from './../../firebase/useFireStoreBySearch';
import { useAuth } from './../../contexts/AuthContext';
import AppText from '../GeneralComponents/AppText';
import CreateNewList from '../Modals/CreateNewList';
import AppButton from '../GeneralComponents/AppButton';
import { useNavigation } from '@react-navigation/native';
import LoadingScreen from '../AppComponents/LoadingScreen';

const HomeScreen = () => {

    const [modalVisible, setModalVisible] = useState(false);

    const { currentUser, deleteList } = useAuth();
    const navigation = useNavigation();
    const { docs, loading } = useFirestoreBySearch('lists', currentUser.id, 'users', 'array-contains');    

    async function handleSelectList(item){
        navigation.navigate('EditList', {
            data: item
        })
    }

    async function handleDeleteItem(id){
        await deleteList(id);
    }

    return (
        <>
            {!loading ? 
                docs.length === 0 ?
                    <View style={[styles.screen, {flex: 1, justifyContent: 'center', alignItems: 'center'}]}>
                        <Image style={{width: '80%', height: '100%'}} source={require('../../../assets/home-bg.png')}/>
                    </View>
                    :
                    <View style={{flex: 1, backgroundColor: defaultStyles.colors.secondary}}>
                        <View style={[styles.screen, {paddingBottom: 20}]}>
                            <FlatList
                                data={docs.sort((a,b)=> b.timeStamp - a.timeStamp)}
                                keyExtractor={(item)=> item.id}
                                renderItem={({item})=>(
                                    <View style={styles.ListView}>
                                        <View style={{flex: 1}}>
                                            <AppText>{item.name}</AppText>
                                            <Text style={styles.date}>last updated {moment(item.timeStamp.toDate()).calendar()}</Text>
                                        </View>
                                        <AppButton
                                            onPress={()=>handleSelectList(item)}
                                            title={'Select'}
                                            style={styles.selectButton}
                                            textStyle={{color: defaultStyles.colors.secondary}}
                                        />
                                        <AppButton
                                            onPress={()=>handleDeleteItem(item.id)}
                                            title={'X'}
                                            style={styles.deleteButton}
                                            textStyle={{color: defaultStyles.colors.secondary}}
                                        />
                                    </View>
                                )}
                            />
                        </View>
                    </View>
                :
                <LoadingScreen />
            }
            <View style={{backgroundColor: defaultStyles.colors.secondary}}>
                <AdMobBanner
                    bannerSize="smartBannerPortrait"
                    // adUnitID="ca-app-pub-3940256099942544/6300978111" // Test ID, Replace with your-admob-unit-id
                    adUnitID="ca-app-pub-1806394024936599/3942933688"
                    servePersonalizedAds // true or false
                    onDidFailToReceiveAdWithError={(err)=>console.error(err)}
                />
            </View>
            <TouchableOpacity style={[styles.addIcon, {zIndex: 50}]} onPress={()=>setModalVisible(true)}>
                    <Ionicons name="add-outline" size={55} color={defaultStyles.colors.secondary} />
            </TouchableOpacity>
            <Modal
                visible={modalVisible}
                onRequestClose={()=>setModalVisible(!modalVisible)} 
                animationType='slide'
            >
                <CreateNewList setModalVisible={setModalVisible} />
            </Modal>
        </>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    screen: {
        flex: 1, 
        backgroundColor: defaultStyles.colors.secondary,
        paddingHorizontal: 15,
    },
    addIcon: {
        position: 'absolute',
        width: 60,
        height: 60,
        bottom: 15,
        right: 15,
        borderRadius: 30,
        backgroundColor: defaultStyles.colors.primary,
        justifyContent: 'center',
        alignItems: "center",
    },
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
    ListView: {
        paddingVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    selectButton: {
        backgroundColor: defaultStyles.colors.primary,
        width: '25%'
    },
    date: {
        color: defaultStyles.colors.medium,
        paddingTop: 5
    },
    deleteButton: {
        backgroundColor: defaultStyles.colors.danger,
        width: '15%',
        marginLeft: 5
    }
})
