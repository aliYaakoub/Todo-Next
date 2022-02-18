import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native'
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
    const [errMsg, setErrMsg] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { login, currentUser } = useAuth();
    const navigation = useNavigation();

    async function handleSubmit(){
        setErrMsg('')
        if(email === '' || password === ''){
            return setErrMsg('please fill all fields')
        }
        else{
            setLoading(true)
            try{
                await login(email, password);
                navigation.navigate('Drawer')
            }
            catch(err){
                if(err.message.includes('invalid-email')){
                    setErrMsg('Invalid Email')
                }
                else if(err.message.includes('user-not-found')){
                    setErrMsg('User not found, check if you typed your email wrong')
                }
                else if(err.message.includes('wrong-password')){
                    setErrMsg('Wrong password')
                }
                else{
                    console.error(err.message);
                    setErrMsg('Can\'t log in')
                }
            }
            setLoading(false)
        }
    }

    useEffect(()=>{
        if(currentUser){
            navigation.navigate('Drawer')
        }
        console.log(currentUser);
    }, [currentUser])

    return (
        <Screen style={styles.container} statusBar='dark'>
            <AppTextInput
                icon={'email'}
                name='email'
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
            <AppText 
                onPress={()=>setModalVisible(true)} 
                style={{
                    marginTop: 20, 
                    textDecorationLine: 'underline'
                }}
            >
                    Forgot your Password ?
                </AppText>
            <AppButton
                title={'LogIn'}
                style={styles.loginBtn}
                onPress={handleSubmit}
                disabled={loading}
                textStyle={{color: defaultStyles.colors.text.secondary}}
            />
            <AppText style={{fontSize: 20}}>
                <Text>Don't have an account ? </Text>
                <Text 
                    style={{color: defaultStyles.colors.primary, marginHorizontal: 5}}
                    onPress={()=>navigation.navigate('Signup')}
                >
                    Sign up here
                </Text>
            </AppText>
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
