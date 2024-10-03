import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, SafeAreaView, StatusBar, Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import { addItem } from '../../redux/cartSlice';
import { useNavigation } from '@react-navigation/native';
import CartIconWithBadge from '../cart/CartIconWithBadge';

const imageMap = {
  img1: require('../../../assets/img1.png'),
  img2: require('../../../assets/img2.png'),
  img3: require('../../../assets/img3.png'),
  img4: require('../../../assets/img4.png'),
};

const ProductDetails = ({ route }) => {
  const { product } = route.params;
  const [isLiked, setIsLiked] = useState(false); 
  const [selectedColor, setSelectedColor] = useState(null); 
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const colors = ['#f3c4c4', '#e9e5d9', '#cce8d2', '#d6e3f8', '#2f2e2e'];

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const handleAddToCart = () => {
    dispatch(addItem({ ...product, selectedColor }));
  };

  return (
    <SafeAreaView 
      className="flex-1 bg-white" 
      style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>

      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <ScrollView className="bg-white">
        
        {/* Header */}
        <View className="flex-row justify-between items-center px-4 py-4">
          {/* Back Button */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={require('../../../assets/arrow.png')} />
          </TouchableOpacity>

          {/* Title */}
          <Text className="text-lg font-bold">Details Product</Text>

          {/* Cart Icon */}
        <CartIconWithBadge/>
        </View>

        {/* Product Image */}
        <Image source={imageMap[product.image]} className="w-full h-64" />
        <View className="p-4">
          {/* Product Info */}
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-bold">{product.name}</Text>
            <TouchableOpacity onPress={() => setIsLiked(!isLiked)}>
              <Image
                source={require('../../../assets/Heart.png')}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: isLiked ? '#FF7F7F' : 'gray',
                }}
              />
            </TouchableOpacity>
          </View>

          <Text className="text-lg text-gray-700">{product.price}</Text>
          <Text className="text-xs text-gray-500">(219 people buy this)</Text>

          {/* Color Selection */}
          <Text className="text-sm text-gray-700 mt-4">Choose the color</Text>
          <View className="flex-row mt-2">
            {colors.map((color, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleColorSelect(color)}
                style={{
                  backgroundColor: color,
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  marginRight: 10,
                  borderWidth: selectedColor === color ? 2 : 1,
                  borderColor: selectedColor === color ? '#000' : '#ccc',
                }}
              />
            ))}
          </View>

          {/* Description */}
          <Text className="text-md font-bold mt-6">Description of product</Text>
          <Text className="text-sm text-gray-500 mt-2">{product.description}</Text>

          <View className="flex-row justify-between mt-4">
            <TouchableOpacity
              className="py-3 px-4 rounded-md flex-1 mr-2"
              onPress={handleAddToCart}
              style={{
                backgroundColor: '#67C4A7',
              }}
            >
              <Text className="text-center text-white font-bold">Add to Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-black py-3 px-4 rounded-md flex-1 ml-2">
              <Text className="text-center text-white font-bold">Buy Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductDetails;
