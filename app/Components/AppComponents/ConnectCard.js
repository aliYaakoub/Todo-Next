import React, { useState, useEffect} from 'react'
import { StyleSheet, View } from 'react-native';
import defaultStyles from '../../config/defaultStyles';

import { useAuth } from '../../contexts/AuthContext'
import AppButton from '../GeneralComponents/AppButton';
import AppText from '../GeneralComponents/AppText';

const ConnectCard = ({data, title, onPress, disabled, nameOnly = false}) => {

    const [user, setUser] = useState('');

    const { getUserData } = useAuth();

    useEffect(() => {
        const getUser = async () => {
            const userToGet = await getUserData(data);
            setUser(userToGet.data());
        }
        getUser();
    }, [getUserData, data])

    return (
        <>
            {user ?
                <View style={[styles.card, nameOnly && {justifyContent: 'center', padding: 5}]}>
                    <AppText>{user.username}</AppText>
                    {!nameOnly && <AppButton 
                        title={title}
                        style={[styles.button, title === 'remove' && {backgroundColor: 'red'}]}
                        textStyle={{color: 'white'}}
                        onPress={onPress}
                        disabled={disabled}
                    />}
                </View>
                :
                null
            }
        </>
    );
}

export default ConnectCard

const styles = StyleSheet.create({
    card: {
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // borderWidth: 1,
        // borderColor: defaultStyles.colors.primary,
        // borderRadius: 15,
        // backgroundColor: defaultStyles.colors.light
    },
    button: {
        backgroundColor: defaultStyles.colors.primary,
        // borderColor: defaultStyles.colors.primary,
        // borderWidth: 2,
        width: '45%',
        padding: 8,
        elevation: 20
    }
})