import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const CartIconWithBadge = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const navigation = useNavigation();
  
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
      <View>
        {/* Cart Icon */}
        <Image source={require('../../../assets/Buy.png')} style={{ width: 24, height: 24 }} />
        
        {/* Notification Badge */}
        {totalItems > 0 && (
          <View
            style={{
              position: 'absolute',
              right: -6,
              top: -3,
              backgroundColor: 'red',
              borderRadius: 10,
              width: 20,
              height: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontSize: 12 }}>{totalItems}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CartIconWithBadge;
