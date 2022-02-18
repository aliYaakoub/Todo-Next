import React, { useState } from 'react'
import { StyleSheet, ScrollView, View, Alert } from 'react-native'
import { AdMobBanner } from 'expo-ads-admob'

import defaultStyles from '../../config/defaultStyles';
import AppButton from '../GeneralComponents/AppButton';
import AppTextInput from '../GeneralComponents/AppTextInput';
import AppText from './../GeneralComponents/AppText';
import { useAuth } from '../../contexts/AuthContext';

const SettingScreen = () => {

    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [usernameErrMsg, setUsernameErrMsg] = useState('');
    const [emailErrMsg, setEmailErrMsg] = useState('');
    const [passErrMsg, setPassErrMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const {changeUsername, updateEmailFunc, updatePasswordFunc, currentUser, setChanges } = useAuth()

    async function handleUsernameUpdate(){
        setUsernameErrMsg('')
        if(!newUsername.trim()){
            return setUsernameErrMsg('you have to type a new Username first.')
        }
        else if(newUsername.trim().length < 5){
            return setUsernameErrMsg('username is too short.')
        }
        else if(newUsername.trim().length > 20){
            return setUsernameErrMsg('username is too large.')
        }
        setLoading(true)
        try{
            await changeUsername(currentUser.id, newUsername.trim());
            setChanges(old => old + 1)
            setNewUsername('')
            Alert.alert('username changed successfully.')
        }
        catch(err){
            console.error(err.message);
            Alert.alert('an error occured, please try again later.')
        }
        setLoading(false)
    }

    async function handleEmailUpdate(){
        setEmailErrMsg('');
        if(!newEmail.trim()){
            return setEmailErrMsg('you have to enter a new email first.')
        }
        setLoading(true);
        try{
            await updateEmailFunc(newEmail.trim())
            Alert.alert('Email updated successfully');
            setNewEmail('');
        }
        catch(err){
            console.error(err.message);
            if(err.message.includes('requires-recent-login')){
                setEmailErrMsg('this operation requires a recent login.')
            }
            else if(err.message.includes('invalid-email')){
                setEmailErrMsg('invalid email')
            }
            else{
                setEmailErrMsg('an error occured, please try again later.')
            }   
        }
        setLoading(false);
    }

    async function handlePasswordUpdate(){
        setPassErrMsg('');
        if(newPassword === '' || confirmPassword === ''){
            return setPassErrMsg('please fill all required fields.')
        }
        else if(newPassword !== confirmPassword){
            return setPassErrMsg('passwords don\'t match.')
        }
        setLoading(true)
        try{
            await updatePasswordFunc(newPassword.trim());
            setNewPassword('');
            setConfirmPassword('');
            Alert.alert('password updated successfully');
        }
        catch(err){
            console.error(err.message);
            if(err.message.includes('requires-recent-login')){
                setPassErrMsg('this operation requires a recent login.')
            }
            else {
                setPassErrMsg('an error occured, please try again later.')
            }
        }
        setLoading(false)
    }

    return (
        <ScrollView style={styles.screen}>
            <View style={{flex: 1, paddingBottom: 20}}>
                <View style={{alignItems: 'center',paddingVertical: 20}}>
                    <AppText>Change your username</AppText>
                    {usernameErrMsg ? <AppText style={{color: defaultStyles.colors.danger, paddingTop: 10}}>{usernameErrMsg}</AppText> : null}
                    <AppTextInput
                        containerStyle={[styles.containerStyle, usernameErrMsg && {borderBottomColor: defaultStyles.colors.danger}]}
                        placeholder={'New Username'}
                        value={newUsername}
                        onChangeText={(val)=>setNewUsername(val)}
                        icon={'account'}
                    />
                    <AppButton
                        title={'Submit'}
                        style={styles.button}
                        textStyle={{color: 'white'}}
                        onPress={()=>handleUsernameUpdate()}
                        disabled={loading}
                    />
                </View>

                <View style={{alignItems: 'center',paddingVertical: 20}}>
                    <AppText>Change your Email</AppText>
                    {emailErrMsg ? <AppText style={{color: defaultStyles.colors.danger, paddingTop: 10}}>{emailErrMsg}</AppText> : null}
                    <AppTextInput
                        containerStyle={[styles.containerStyle, emailErrMsg && {borderBottomColor: defaultStyles.colors.danger}]}
                        placeholder={'New Email'}
                        value={newEmail}
                        onChangeText={(val)=>setNewEmail(val)}
                        icon={'email'}
                    />
                    <AppButton
                        title={'Submit'}
                        style={styles.button}
                        textStyle={{color: 'white'}}
                        onPress={()=>handleEmailUpdate()}
                        disabled={loading}
                    />
                </View>

                <View style={{alignItems: 'center',paddingVertical: 20}}>
                    <AppText>Change your Password</AppText>
                    {passErrMsg ? <AppText style={{color: defaultStyles.colors.danger, paddingTop: 10}}>{passErrMsg}</AppText> : null}
                    <AppTextInput
                        containerStyle={[styles.containerStyle, passErrMsg && {borderBottomColor: defaultStyles.colors.danger}]}
                        placeholder={'New Password'}
                        value={newPassword}
                        onChangeText={(val)=>setNewPassword(val)}
                        icon={'lock'}
                        secureTextEntry
                    />
                    <AppTextInput
                        containerStyle={[styles.containerStyle, passErrMsg && {borderBottomColor: defaultStyles.colors.danger}]}
                        placeholder={'Confirm new Password'}
                        value={confirmPassword}
                        onChangeText={(val)=>setConfirmPassword(val)}
                        icon={'lock'}
                        secureTextEntry
                    />
                    <AppButton
                        title={'Submit'}
                        style={styles.button}
                        textStyle={{color: 'white'}}
                        onPress={()=>handlePasswordUpdate()}
                        disabled={loading}
                    />
                </View>
            </View>
            <View style={{backgroundColor: defaultStyles.colors.secondary}}>
                <AdMobBanner
                    bannerSize="smartBannerPortrait"
                    // adUnitID="ca-app-pub-3940256099942544/6300978111" // Test ID, Replace with your-admob-unit-id
                    adUnitID="ca-app-pub-1806394024936599/5095167591" 
                    servePersonalizedAds // true or false
                    onDidFailToReceiveAdWithError={(err)=>console.error(err)}
                />
            </View>
        </ScrollView>
    )
}

export default SettingScreen

const styles = StyleSheet.create({
    screen: {
        flex: 1, 
        backgroundColor: defaultStyles.colors.secondary,
        paddingHorizontal: 15,
    },
    button: {
        backgroundColor: defaultStyles.colors.primary,
        // borderColor: defaultStyles.colors.primary,
        // borderWidth: 2,
        width: '70%',
        padding: 8,
        elevation: 20
    },
    containerStyle: {
      borderRadius: 0,
      borderBottomWidth: 1.5,
      backgroundColor: null,
      borderBottomColor: defaultStyles.colors.text.primary,
    },
})
