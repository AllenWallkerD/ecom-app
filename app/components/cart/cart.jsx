import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { removeItem, updateQuantity } from '../../redux/cartSlice';
import { Ionicons } from '@expo/vector-icons';
import CartIconWithBadge from './CartIconWithBadge';

const imageMap = {
  img1: require('../../../assets/img1.png'),
  img2: require('../../../assets/img2.png'),
  img3: require('../../../assets/img3.png'),
  img4: require('../../../assets/img4.png'),
};

export default function Cart({ navigation }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const cartItems = useSelector((state) => state.cart.items);
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const dispatch = useDispatch();
  const [quantities, setQuantities] = useState([]);
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  useEffect(() => {
    setQuantities(
      cartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity || 1,
      }))
    );
  }, [cartItems]);

  const toggleSelectItem = (itemId) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(itemId)
        ? prevSelected.filter((id) => id !== itemId)
        : [...prevSelected, itemId]
    );
  };

  const handleUpdateQuantity = (id, change) => {
    const item = cartItems.find((i) => i.id === id);
    if (item) {
      dispatch(updateQuantity({ id, quantity: item.quantity + change }));
    }
  };

  const handleRemove = (id) => {
    dispatch(removeItem(id));
  };

  const calculateTotal = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => {
        const quantity = quantities.find((q) => q.id === item.id)?.quantity || 1;
        const itemPrice = parseFloat(item.price.replace('$', ''));
        return total + itemPrice * quantity;
      }, 0)
      .toFixed(2);
  };

  const toggleOrderSummary = () => {
    setShowOrderSummary((prev) => !prev);
  };

  return (
    <SafeAreaView 
      className="flex-1 bg-white" 
      style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>

      <StatusBar barStyle="dark-content" backgroundColor="white" />
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-3">
        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        {/* Title */}
        <Text className="text-lg font-bold" style={{ flex: 1, marginRight: 10 }}>Your Cart</Text>

        {/* Cart Icon */}
        <CartIconWithBadge/>
      </View>

      <View style={{ borderBottomWidth: 1, borderColor: '#E5E5E5', marginVertical: 1 }} />

      {/* Cart Items */}
      <FlatList
        data={cartItems}
        renderItem={({ item }) => {
          const isSelected = selectedItems.includes(item.id);

          return (
            <View className="flex-row items-center justify-between my-2 p-2 bg-white">
              {/* Checkbox */}
              <TouchableOpacity onPress={() => toggleSelectItem(item.id)}>
                <Ionicons
                  name={isSelected ? 'checkbox' : 'square-outline'}
                  size={24}
                  color={isSelected ? '#67C4A7' : 'gray'}
                />
              </TouchableOpacity>

              {/* Item Image */}
              <Image source={imageMap[item.image]} className="w-16 h-16 rounded-lg ml-2" />

              {/* Item Details */}
              <View className="ml-4 flex-1">
                <Text className="font-bold">{item.name}</Text>
                <Text className="text-sm text-gray-500">Variant: {item.variant || 'Default'}</Text>
                <Text className="text-lg font-semibold">{item.price}</Text>
              </View>

              {/* Quantity Controls */}
              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={() => handleUpdateQuantity(item.id, -1)}
                  disabled={item.quantity === 1}
                >
                  <Ionicons
                    name="remove-circle-outline"
                    size={24}
                    color={item.quantity === 1 ? 'gray' : '#67C4A7'}
                  />
                </TouchableOpacity>

                <Text className="mx-2 text-lg">{item.quantity}</Text>

                <TouchableOpacity onPress={() => handleUpdateQuantity(item.id, 1)}>
                  <Ionicons name="add-circle-outline" size={24} color="#67C4A7" />
                </TouchableOpacity>

                {/* Remove Item */}
                <TouchableOpacity onPress={() => handleRemove(item.id)}>
                  <Ionicons name="trash-outline" size={24} color="red" style={{ marginLeft: 10 }} />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        keyExtractor={(item) => item.id}
      />

      {/* Static Bottom Section */}
      <View style={{ padding: 20, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#E5E5E5' }}>
        {/* Order Summary Toggle */}
        <TouchableOpacity onPress={toggleOrderSummary} className="flex-row justify-between items-center mb-2">
          <Text className="text-lg font-bold">Order Summary</Text>
          <Ionicons
            name={showOrderSummary ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="black"
          />
        </TouchableOpacity>

        {/* Order Summary Details */}
        {showOrderSummary && (
          <View className="mb-2">
            <Text>Total price ({cartItems.length} items): ${calculateTotal()}</Text>
            <Text className="text-base">Courier: $0.00</Text>
            <Text className="text-base">Marketplace fee: $0.00</Text>
          </View>
        )}

        {/* Totals */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg">Totals:</Text>
          <Text className="text-lg font-bold">${calculateTotal()}</Text>
        </View>

        {/* Payment Button */}
        <TouchableOpacity
          onPress={() => {
            const selectedCartItems = cartItems.filter((item) => selectedItems.includes(item.id));
            navigation.navigate('Checkouts', { cartItems: selectedCartItems, total: calculateTotal() });
          }}
          className="rounded-lg p-3"
          style={{ backgroundColor: '#67C4A7' }}
        >
          <Text className="text-center text-white font-bold">Select payment method</Text>
        </TouchableOpacity>
      </View>
    </View>
    </SafeAreaView>
  );
}
