import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import AnimatedLottieView from 'lottie-react-native'
import defaultStyles from '../../config/defaultStyles'

const LoadingScreen = () => {
    return (
        <View style={[
            StyleSheet.absoluteFillObject, 
            {
                justifyContent: 'center', 
                alignItems: 'center', 
                backgroundColor: defaultStyles.colors.secondary
            }
        ]}>
            <AnimatedLottieView 
                loop
                autoPlay
                source={require('../../../assets/two-points.json')} 
            />
        </View>
    )
}

export default LoadingScreen
