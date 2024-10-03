import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform, SafeAreaView, StatusBar, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import CartIconWithBadge from '../cart/CartIconWithBadge';

export default function Payments({ navigation, route }) {
  const { cartItems = [], totalPrice, courierPrice = 0 } = route.params || {};
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const toggleOrderSummary = () => {
    setShowOrderSummary(!showOrderSummary);
  };

  const calculateTotalPrice = () => {
    return cartItems
      .reduce((total, item) => {
        const itemPrice = parseFloat(item.price.replace('$', ''));
        return total + itemPrice * (item.quantity || 1);
      }, 0)
      .toFixed(2);
  };

  const calculateMarketplaceFee = (totalPrice) => {
    return (totalPrice * 0.01).toFixed(2);
  };

  const calculateTotalAmount = () => {
    const totalPrice = parseFloat(calculateTotalPrice());
    const marketplaceFee = parseFloat(calculateMarketplaceFee(totalPrice));
    const totalCourierPrice = parseFloat(courierPrice);
    return (totalPrice + marketplaceFee + totalCourierPrice).toFixed(2);
  };

  const handlePaymentSuccess = () => {
    setShowSuccessModal(true); 
  };

  const closeModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <SafeAreaView 
      className="flex-1 bg-white" 
      style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>

      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <View className="flex-1">
        <ScrollView className="flex-1 bg-white">
          <View className="flex-row items-center justify-between px-4 py-4">
            <View className="flex-row items-center">
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
              <Text className="text-lg font-bold ml-2">Payment method</Text>
            </View>
            <CartIconWithBadge />
          </View>

          {/* Existing Card Section */}
          <View className="mb-6 px-4">
            <Text className="text-gray-700 font-bold mb-2">Select existing card</Text>
            <View className="flex-row items-center justify-between p-4 border border-gray-200 rounded-lg">
              <View className="flex-row items-center">
                <FontAwesome name="credit-card" size={24} color="gray" />
                <Text className="ml-3 text-gray-700">**** **** **** 1934</Text>
              </View>
              <TouchableOpacity>
                <FontAwesome name="trash" size={24} color="gray" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Input New Card Section */}
          <View className="mb-6 px-4">
            <Text className="text-gray-700 font-bold mb-2">Or input new card</Text>
            <TextInput className="p-4 border border-gray-200 rounded-lg mb-3" placeholder="Card number" keyboardType="numeric" />
            <View className="flex-row justify-between mb-3">
              <TextInput className="flex-1 p-4 border border-gray-200 rounded-lg mr-3" placeholder="mm/yy" />
              <TextInput className="flex-1 p-4 border border-gray-200 rounded-lg" placeholder="ccv/csv" />
            </View>
            <TextInput className="p-4 border border-gray-200 rounded-lg" placeholder="Card holder" />
          </View>
        </ScrollView>

        <View className="px-4 py-4" style={{ backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#E5E5E5' }}>
          {/* Order Summary Toggle */}
          <TouchableOpacity onPress={toggleOrderSummary} className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-bold">Order Summary</Text>
            <Ionicons name={showOrderSummary ? 'chevron-up' : 'chevron-down'} size={20} color="black" />
          </TouchableOpacity>

          {showOrderSummary && (
            <View className="mb-2">
              <Text>Total price ({cartItems.length} items): ${calculateTotalPrice()}</Text>
              <Text className="text-base">Courier: ${parseFloat(courierPrice).toFixed(2)}</Text>
              <Text className="text-base">Marketplace fee: ${calculateMarketplaceFee(calculateTotalPrice())}</Text>
            </View>
          )}

          {/* Totals */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg">Totals:</Text>
            <Text className="text-lg font-bold">${calculateTotalAmount()}</Text>
          </View>

          {/* Payment Button */}
          <TouchableOpacity
            onPress={handlePaymentSuccess}
            className="rounded-lg p-3"
            style={{ backgroundColor: '#67C4A7' }}
          >
            <Text className="text-center text-white font-bold">Select payment method</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="slide" 
        onRequestClose={closeModal}
      >
        <View className="flex-1 justify-end items-center " style={{backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View className="bg-white p-6 rounded-t-lg w-full">
            <TouchableOpacity onPress={closeModal} className="self-end mb-4">
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
            <View className="items-center mb-4">
              <Ionicons name="checkmark-circle" size={80} color="#67C4A7" />
              <Text className="text-lg font-bold mt-4">Congrats! Your payment is successfully processed</Text>
              <Text className="text-gray-600 text-center mt-2">
                Track your order or chat directly with the seller. Download the order summary below.
              </Text>
            </View>

            {/* Invoice Download Section */}
            <TouchableOpacity className="flex-row items-center justify-between border border-gray-200 rounded-lg p-3 mb-4">
              <Ionicons name="document" size={24} color="gray" />
              <Text className="ml-3 flex-1 text-gray-700">order_invoice</Text>
              <Ionicons name="download" size={24} color="gray" />
            </TouchableOpacity>

            {/* Continue Button */}
            <TouchableOpacity
              onPress={closeModal}
              className="rounded-lg p-3"
              style={{ backgroundColor: '#67C4A7' }}
            >
              <Text className="text-center text-white font-bold">Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
