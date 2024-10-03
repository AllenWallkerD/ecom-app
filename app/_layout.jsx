import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import Home from './(tabs)/home';
import Search from './(tabs)/search';
import Layout from './(tabs)/_layout';
import Cart from './components/cart/cart';
import { store } from './redux/store';
import ProductDetails from './components/product/ProductDetails';
import Checkouts from './components/payment/Checkouts';
import Payments from './components/payment/Payments';
import App from '.';

const Stack = createStackNavigator();

export default function RootLayout() {
  return (
    <Provider store={store}>
      <NavigationContainer independent={true}>
        <Stack.Navigator>
          <Stack.Screen name="(tabs)" component={Layout} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={Home} options={{ headerShown:false }} />
          <Stack.Screen name="ProductDetails" component={ProductDetails} options={{headerShown: false}} />
          <Stack.Screen name="Search" component={Search} options={{ headerShown: false }} />
          <Stack.Screen name="Cart" component={Cart} options={{ headerShown: false }} />
          <Stack.Screen name="Checkouts" component={Checkouts} options={{ headerShown: false }} />          
          <Stack.Screen name="Payments" component={Payments} options={{ headerShown: false }} />      
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
