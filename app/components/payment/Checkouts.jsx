import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, TextInput, ScrollView, Modal, Platform, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CartIconWithBadge from '../cart/CartIconWithBadge';

const imageMap = {
    img1: require('../../../assets/img1.png'),
    img2: require('../../../assets/img2.png'),
    img3: require('../../../assets/img3.png'),
    img4: require('../../../assets/img4.png'),
  };

export default function Checkouts({ navigation, route }) {
  const [showList, setShowList] = useState(true);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); 
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState(null);
  const [courierPrice, setCourierPrice] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const { cartItems = [], total = 0 } = route.params || {};

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

  const handleSelectDeliveryOption = (option) => {
    let price = 0;
    if (option === 'Express') price = 14.99;
    if (option === 'Regular') price = 7.99;
    if (option === 'Cargo') price = 2.99;
    
    setSelectedDeliveryOption(option);
    setCourierPrice(price);
    setModalVisible(false);
    setErrorMessage('');
  };

  const toggleListVisibility = () => setShowList((prev) => !prev);
  const toggleOrderSummary = () => setShowOrderSummary((prev) => !prev);

  const handleProceedToPayment = () => {
    if (!selectedDeliveryOption) {
      setErrorMessage('Please select a delivery option.');
      return;
    }
  
    navigation.navigate('Payments', {
      cartItems,
      totalPrice: calculateTotalAmount(),
      courierPrice: courierPrice.toFixed(2),
      marketplaceFee: (parseFloat(calculateTotalPrice()) * 0.01).toFixed(2),
    });
  };  


  return (
    <SafeAreaView 
    className="flex-1 bg-white" 
    style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>

    <StatusBar barStyle="dark-content" backgroundColor="white" />
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-lg font-bold ml-2">Checkouts</Text>
        </View>
        <CartIconWithBadge/>
      </View>
      <View style={{ borderBottomWidth: 1, borderColor: '#E5E5E5', marginVertical: 1 }} />

      {/* Delivery Address */}
      <View className="p-2 flex-row justify-between items-center my-2">
        <Text className="text-sm text-gray-600">Delivery to</Text>
        <TouchableOpacity className="flex-row items-center">
          <Text className="font-bold text-s mr-1">Salatiga City, Central Java</Text>
          <Ionicons name="chevron-down" size={15} color="gray" />
        </TouchableOpacity>
      </View>
      <View style={{ borderBottomWidth: 1, borderColor: '#E5E5E5', marginVertical: 1 }} />

      {/* Scrollable Section */}
      <ScrollView style={{ flex: 1 }}>
        <View className="p-4">
          {/* Cart Items List */}
          {showList && (
            <FlatList
              data={cartItems}
              renderItem={({ item }) => (
                <View className="flex-row items-center justify-between my-2 p-2 bg-white">
                  {/* Item Image */}
                  <Image source={imageMap[item.image]} className="w-16 h-16 rounded-lg ml-2" />

                  {/* Item Details */}
                  <View className="ml-4 flex-1">
                    <Text className="font-bold">{item.name}</Text>
                    <Text className="text-sm text-gray-500">Variant: {item.variant || 'Default'}</Text>
                    <Text className="text-lg font-semibold">{item.price}</Text>
                  </View>

                  {/* Static Quantity */}
                  <Text className="mx-2 text-lg">{item.quantity} quantity</Text>
                </View>
              )}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          )}

          {/* Hide List Button */}
          <TouchableOpacity 
            onPress={toggleListVisibility} 
            style={{ alignSelf: 'center', marginVertical: 10 }}
          >
            <Text className="text-sm font-bold text-teal-600">{showList ? 'Hide list' : 'Show list'}</Text>
          </TouchableOpacity>

          {/* Delivery Option Selection */}
          <TouchableOpacity 
            className="p-3 border border-gray-300 rounded-lg mb-3 flex-row justify-between items-center"
            onPress={() => setModalVisible(true)}
          >
            <Text className="text-sm text-gray-500">{selectedDeliveryOption ? selectedDeliveryOption : "Select the delivery option"}</Text>
            <Ionicons name="chevron-forward" size={20} color="gray" />
          </TouchableOpacity>

          {/* Error Message */}
          {errorMessage ? (
            <Text className="text-red-500 text-sm mb-2">{errorMessage}</Text>
          ) : null}

          {/* Apply a Discount */}
          <View className="p-3 border border-gray-300 rounded-lg mb-3 flex-row items-center justify-between">
            <TextInput placeholder="Apply a discount" style={{ flex: 1, marginRight: 10 }} />
            <TouchableOpacity>
              <Ionicons name="chevron-forward" size={20} color="gray" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Section */}
      <View style={{ padding: 20, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#E5E5E5' }}>
        {/* Order Summary Toggle */}
        <TouchableOpacity onPress={toggleOrderSummary} className="flex-row justify-between items-center mb-2">
          <Text className="text-lg font-bold">Order Summary</Text>
          <Ionicons name={showOrderSummary ? 'chevron-up' : 'chevron-down'} size={20} color="black" />
        </TouchableOpacity>

        {/* Order Summary Details */}
        {showOrderSummary && (
          <View className="mb-2">
            <Text>Total price ({cartItems.length} items): ${calculateTotalPrice()}</Text>
            <Text className="text-base">Courier: ${courierPrice.toFixed(2)}</Text>
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
          onPress={handleProceedToPayment}
          className="rounded-lg p-3"
          style={{ backgroundColor: '#67C4A7' }}
        >
          <Text className="text-center text-white font-bold">Select payment method</Text>
        </TouchableOpacity>
      </View>
        {/* Delivery Option Modal */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={{ width: '100%', backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 }}>
              
              {/* Close Button */}
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-bold">Select the delivery</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} />
                </TouchableOpacity>
              </View>

              {/* Delivery Options */}
              <TouchableOpacity 
                onPress={() => handleSelectDeliveryOption('Express')} 
                style={{
                  backgroundColor: selectedDeliveryOption === 'Express' ? '#E8F5F1' : '#F5F5F5',
                  padding: 15,
                  borderRadius: 10,
                  borderWidth: selectedDeliveryOption === 'Express' ? 2 : 1,
                  borderColor: selectedDeliveryOption === 'Express' ? '#67C4A7' : '#E5E5E5',
                  marginBottom: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View>
                    <Text className="text-base font-semibold">Express</Text>
                    <Text className="text-sm text-gray-500">1-3 days delivery</Text>
                  </View>
                </View>
                <Text className="text-base font-bold">$14.99</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => handleSelectDeliveryOption('Regular')} 
                style={{
                  backgroundColor: selectedDeliveryOption === 'Regular' ? '#E8F5F1' : '#F5F5F5',
                  padding: 15,
                  borderRadius: 10,
                  borderWidth: selectedDeliveryOption === 'Regular' ? 2 : 1,
                  borderColor: selectedDeliveryOption === 'Regular' ? '#67C4A7' : '#E5E5E5',
                  marginBottom: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View>
                    <Text className="text-base font-semibold">Regular</Text>
                    <Text className="text-sm text-gray-500">2-4 days delivery</Text>
                  </View>
                </View>
                <Text className="text-base font-bold">$7.99</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => handleSelectDeliveryOption('Cargo')} 
                style={{
                  backgroundColor: selectedDeliveryOption === 'Cargo' ? '#E8F5F1' : '#F5F5F5',
                  padding: 15,
                  borderRadius: 10,
                  borderWidth: selectedDeliveryOption === 'Cargo' ? 2 : 1,
                  borderColor: selectedDeliveryOption === 'Cargo' ? '#67C4A7' : '#E5E5E5',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View>
                    <Text className="text-base font-semibold">Cargo</Text>
                    <Text className="text-sm text-gray-500">7-14 days delivery</Text>
                  </View>
                </View>
                <Text className="text-base font-bold">$2.99</Text>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>
      </View>
      </SafeAreaView>
  );
}