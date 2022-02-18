import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import Checkbox from 'expo-checkbox';

import AppButton from '../GeneralComponents/AppButton';
import Screen from '../GeneralComponents/Screen';
import AppTextInput from '../GeneralComponents/AppTextInput';
import defaultStyles from '../../config/defaultStyles'
import { useAuth } from '../../contexts/AuthContext';
import ErrorMessage from '../GeneralComponents/ErrorMessage';
import AppText from '../GeneralComponents/AppText';

const LoginScreen = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false)

    const { signup } = useAuth();
    const navigation = useNavigation();

    async function handleSubmit(){
        setErrMsg('')
        if(email === '' || password === ''){
            return setErrMsg('please fill all fields')
        }
        else if(password != confirmPassword){
            return setErrMsg('Passwords don\'t match')
        }
        else if(password.length < 6){
            return setErrMsg('password too short')
        }
        else{
            setLoading(true)
            try{
                await signup(email, password);
                navigation.navigate('Drawer')
            }
            catch(err){
                if(err.message.includes('invalid-email')){
                    setErrMsg('Invalid Email')
                }
                else if(err.message.includes('email-already-in-use')){
                    setErrMsg('email already in use');
                }
                else{
                    console.error(err.message);
                    setErrMsg('Can\'t sign up')
                }
            }
            setLoading(false)
        }
    }

    return (
        <Screen style={styles.container} statusBar='dark'>
            <AppTextInput
                icon={'email'}
                name='email'
                autoCorrect={false}
                autoCapitalize='none'
                KeyboardType='email-address'
                textContentType='emailAddress'
                value={email}
                onChangeText={(val)=>setEmail(val)}
                placeholder={'Email'}
                containerStyle={styles.containerStyle}
                style={{paddingLeft: 5}}
            />
            <AppTextInput
                icon={'lock'}
                name='password'
                value={password}
                autoCorrect={false}
                autoCapitalize='none'
                textContentType='password'
                secureTextEntry={!showPassword}
                onChangeText={(val)=>setPassword(val)}
                placeholder={'Password'}
                containerStyle={styles.containerStyle}
                style={{paddingLeft: 5}}
            />
            <AppTextInput
                icon={'lock'}
                name='confirmpassword'
                value={confirmPassword}
                autoCorrect={false}
                autoCapitalize='none'
                textContentType='password'
                secureTextEntry={!showPassword}
                onChangeText={(val)=>setConfirmPassword(val)}
                placeholder={'Confirm Password'}
                containerStyle={styles.containerStyle}
                style={{paddingLeft: 5}}
            />
            <View style={{paddingVertical: 10 , width: '100%'}}>
                <TouchableWithoutFeedback onPress={()=>setShowPassword(old => !old)}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                        <Checkbox
                            value={showPassword}
                            onValueChange={()=>setShowPassword(old => !old)}
                            color={showPassword ? defaultStyles.colors.primary : undefined}
                            style={{marginHorizontal: 20}}
                        />
                        <AppText>Show Password</AppText>
                    </View>
                </TouchableWithoutFeedback>
            </View>
            <ErrorMessage error={errMsg} />
            <AppButton
                title={'Sign Up and Log In'}
                style={styles.loginBtn}
                onPress={handleSubmit}
                disabled={loading}
                textStyle={{color: defaultStyles.colors.text.secondary}}
            />
        </Screen>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: defaultStyles.colors.secondary,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    },
    containerStyle: {
      borderRadius: 0,
      borderBottomWidth: 1.5,
      backgroundColor: null,
      borderBottomColor: defaultStyles.colors.text.primary
    },
    loginBtn: {
        backgroundColor: defaultStyles.colors.primary,
        marginTop: 50
    }
})
