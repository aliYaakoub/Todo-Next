import { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import { AdMobInterstitial } from 'expo-ads-admob';

import LoginScreen from './app/Components/Screens/LoginScreen';
import SignupScreen from './app/Components/Screens/SignupScreen';
import DrawerScreen from './app/Components/Navigation/DrawerScreen';
import EditListScreen from './app/Components/Screens/EditListScreen';

const Stack = createNativeStackNavigator();

export default function Index() {

  useEffect(()=>{
    const fetchAd = async () =>{
      await AdMobInterstitial.setAdUnitID('ca-app-pub-1806394024936599/1273334474');
      // await AdMobInterstitial.setAdUnitID('ca-app-pub-3940256099942544/1033173712'); // Test ID, Replace with your-admob-unit-id
      await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
      await AdMobInterstitial.showAdAsync();
    }
    fetchAd();
  },[])

  return (
      <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}} >
              <Stack.Screen name='Login' component={LoginScreen} />
              <Stack.Screen name='Signup' component={SignupScreen} />
              <Stack.Screen name='Drawer' component={DrawerScreen} />
              <Stack.Screen name='EditList' component={EditListScreen} />
          </Stack.Navigator>
      </NavigationContainer>
  );
}
