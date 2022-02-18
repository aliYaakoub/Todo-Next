import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { AdMobBanner } from 'expo-ads-admob'

import defaultStyles from '../../config/defaultStyles';
import UserConnects from '../AppComponents/UserConnects';
import AppText from './../GeneralComponents/AppText';
import ConnectRequests from './../AppComponents/ConnectRequests';

const ConnectsScreen = () => {

    const [currPage, setCurrPage] = useState(1)

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <TouchableOpacity style={{width: '50%', height: '100%'}} onPress={()=>setCurrPage(1)}>
                    <View style={[styles.headerBtn, currPage === 1 && {borderBottomWidth: 2}]}>
                        <AppText style={{textAlign: 'center'}}>Connects</AppText>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{width: '50%', height: '100%'}} onPress={()=>setCurrPage(2)}>
                    <View style={[styles.headerBtn, currPage === 2 && {borderBottomWidth: 2}]}>
                        <AppText style={{textAlign: 'center'}}>requests</AppText>
                    </View>
                </TouchableOpacity>
            </View>
            {currPage === 1 ?
                <UserConnects />
                :
                <ConnectRequests />
            }
            <View style={{backgroundColor: defaultStyles.colors.secondary}}>
                <AdMobBanner
                    bannerSize="smartBannerPortrait"
                    adUnitID="ca-app-pub-3940256099942544/6300978111" // Test ID, Replace with your-admob-unit-id
                    adUnitID="ca-app-pub-1806394024936599/8896673625"
                    servePersonalizedAds // true or false
                    onDidFailToReceiveAdWithError={(err)=>console.error(err)}
                />
            </View>
        </View>
    )
}

export default ConnectsScreen

const styles = StyleSheet.create({
    screen: {
        flex: 1, 
        backgroundColor: defaultStyles.colors.secondary
    },
    header: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-around', 
    },
    headerBtn: {
        borderBottomColor: defaultStyles.colors.primary,
        paddingVertical: 20,
        marginBottom: 10
    }
})
