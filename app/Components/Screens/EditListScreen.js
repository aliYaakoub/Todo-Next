import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Modal, FlatList, Image } from 'react-native'
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import AppText from '../GeneralComponents/AppText';
import Screen from '../GeneralComponents/Screen'
import defaultStyles from '../../config/defaultStyles';
import CreateNewListItem from '../Modals/CreateNewListItem';
import useFirestoreBySearch from './../../firebase/useFireStoreBySearch';
import ListItem from '../AppComponents/ListItem';
import AddUsersToList from '../Modals/AddUsersToList';
import { useAuth } from './../../contexts/AuthContext';
import LoadingScreen from '../AppComponents/LoadingScreen';

const EditListScreen = ({route}) => {

    const [modalVisible, setModalVisible] = useState(false);
    const [addUsersModalVisible, setAddUserModalVisible] = useState(false);
    const [list, setList] = useState(null);
    const [user, setUser] = useState('');

    const { docs, loading } = useFirestoreBySearch('todo-items', route.params.data.id, 'list', '==')
    const navigation = useNavigation();
    const { currentUser, getUserData } = useAuth();

    useEffect(()=>{
        setList(route.params.data)
        const getUser = async () => {
            const userToGet = await getUserData(route.params.data.createdBy);
            setUser(userToGet.data());
        }
        getUser();
    }, [route.params.data, getUserData])

    return (
        <>
            {loading ?
                <LoadingScreen />
                :
                docs.length > 0 ?
                    <Screen style={styles.screen}>
                        <AppText style={{fontSize: 25, textAlign: 'center'}}>{route.params.data.name}</AppText>
                        {list && list.createdBy === currentUser.id ? 
                            <AppText style={{fontSize: 15, textAlign: 'center', opacity: 0.5}}>Created By You.</AppText>
                            :
                            <AppText  style={{fontSize: 15, textAlign: 'center', opacity: 0.5}}>{user && `Created By ${user.username}`}</AppText>
                        }
                        <FlatList
                            data={docs.sort((a,b)=> a.timeStamp - b.timeStamp)}
                            keyExtractor={(item)=> item.id}
                            renderItem={({item})=>(
                                <ListItem data={item} />
                            )}
                        />
                    </Screen>
                    :
                    <View style={[styles.screen, {flex: 1, justifyContent: 'center', alignItems: 'center'}]}>
                        <Image style={{width: '70%', height: '80%'}} source={require('../../../assets/list-bg.png')} />
                    </View>
            }
            <View style={styles.nav}>
                <TouchableOpacity style={[styles.backIcon, {zIndex: 50}]} onPress={()=>navigation.goBack()}>
                        <AntDesign name="back" size={40} color={defaultStyles.colors.text.primary} />
                </TouchableOpacity>
                {list &&
                    list.createdBy === currentUser.id && 
                    <TouchableOpacity style={[styles.addIcon, {zIndex: 50}]} onPress={()=>setAddUserModalVisible(true)}>
                            <AntDesign name="addusergroup" size={40} color={defaultStyles.colors.secondary} />
                    </TouchableOpacity>
                }
                <TouchableOpacity style={[styles.addIcon, {zIndex: 50}]} onPress={()=>setModalVisible(true)}>
                        <Ionicons name="add-outline" size={55} color={defaultStyles.colors.secondary} />
                </TouchableOpacity>
            </View>
            <Modal
            visible={modalVisible}
            onRequestClose={()=>setModalVisible(!modalVisible)}
            animationType='slide'
            >
                <CreateNewListItem setModalVisible={setModalVisible} listId={route.params.data.id} />
            </Modal>
            <Modal
            visible={addUsersModalVisible}
            onRequestClose={()=>setAddUserModalVisible(!modalVisible)}
            animationType='slide'
            >
                <AddUsersToList setModalVisible={setAddUserModalVisible} listId={route.params.data.id} />
            </Modal>
        </>
    )
}

export default EditListScreen

const styles = StyleSheet.create({
    screen: {
        flex: 1, 
        backgroundColor: defaultStyles.colors.secondary,
        paddingHorizontal: 15,
    },
    addIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: defaultStyles.colors.primary,
        justifyContent: 'center',
        alignItems: "center",
        marginHorizontal: 5
    },
    nav: {
        position: 'absolute',
        bottom: 15,
        right: 15,
        flexDirection: 'row'
    },
    backIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: defaultStyles.colors.primary,
        justifyContent: 'center',
        alignItems: "center",
        marginHorizontal: 5
    }
})
