import React, { useState, useEffect } from 'react'
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native'
import { Feather } from '@expo/vector-icons';

import defaultStyles from '../../config/defaultStyles';
import AppTextInput from './../GeneralComponents/AppTextInput';
import AppText from '../GeneralComponents/AppText';
import AppButton from '../GeneralComponents/AppButton';
import { useAuth } from './../../contexts/AuthContext';
import ConnectCard from '../AppComponents/ConnectCard';
import ListItemsSeperator from '../GeneralComponents/ListItemsSeperator';
import { getDoc, doc } from 'firebase/firestore';
import { projectFireStore } from './../../firebase/config';

const AddUsersToList = ({setModalVisible, listId}) => {

    const [loading, setLoading] = useState(false);
    const [list, setList] = useState(null);
    const [changes, setChanges] = useState(0);

    const { currentUser, addUserToList, removeUserFromList } = useAuth();

    useEffect(()=>{
        const getList = async () => {
            const listData = await getDoc(doc(projectFireStore, 'lists', listId))
            setList(listData.data())
        }
        getList();
    }, [listId, changes])
    console.log(listId);

    async function handleAddUser(userId){
        setLoading(true)
        try{
            await addUserToList(listId, userId)
            setChanges(old => old + 1)
        }
        catch(err){
            Alert.alert('an error occured, please try again later.')
        }
        setLoading(false)
    }
    async function handleRemoveUser(userId){
        setLoading(true)
        try{
            await removeUserFromList(listId, userId)
            setChanges(old => old + 1)
        }
        catch(err){
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
            {list != null ? 
                currentUser.connects.length === 0 ? 
                    <AppText style={styles.text}>You have no connects</AppText>
                    :
                    <>
                        {currentUser.connects.filter((user)=> !list.users.includes(user)).length === 0 ?
                            null
                            :
                            <>
                                <AppText>share your list with : </AppText>
                                <FlatList
                                    data={currentUser.connects.filter((user)=> !list.users.includes(user))}
                                    renderItem={({item})=>(
                                        <ConnectCard
                                            data={item}
                                            onPress={()=>handleAddUser(item)}
                                            title={'add'}
                                            disabled={loading}
                                        />
                                    )}
                                    ItemSeparatorComponent={ListItemsSeperator}
                                />
                            </>
                        }
                    </>
                :
                <AppText>loading</AppText>
            }
            {list != null ? 
                list.users.length === 1 ?
                    <AppText>you are currently the only user for this list</AppText>
                    :
                    <>
                        <AppText>users in this list group</AppText>
                        <FlatList
                            data={list.users.filter((user) => user !== currentUser.id)}
                            renderItem={({item})=>(
                                <ConnectCard 
                                    data={item} 
                                    onPress={()=>handleRemoveUser(item)} 
                                    title={'remove'} 
                                    disabled={loading} 
                                />
                            )}
                            ItemSeparatorComponent={ListItemsSeperator}
                        />
                    </>
                :
                <AppText>loading</AppText>
            }
        </View>
    )
}

export default AddUsersToList

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