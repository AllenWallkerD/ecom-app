import React, { useState, useEffect } from 'react'; 
import { View, Text, TextInput, Image, FlatList, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Platform, Dimensions } from 'react-native';
import { useDispatch } from 'react-redux'; 
import { addItem } from '../redux/cartSlice';
import productsData from '../../lib/products.json'
import CartIconWithBadge from '../components/cart/CartIconWithBadge';

const { width } = Dimensions.get('window');

const categories = [
  { id: '1', title: 'Apparel', icon: require('../../assets/apparel.png') },
  { id: '2', title: 'School', icon: require('../../assets/school.png') },
  { id: '3', title: 'Sports', icon: require('../../assets/sports.png') },
  { id: '4', title: 'Electronic', icon: require('../../assets/electronic.png') },
  { id: '5', title: 'All', icon: require('../../assets/all.png') },
];

const banners = [
  { id: '1', image: require('../../assets/banner1.png') },
  { id: '2', image: require('../../assets/banner2.png') },
];

const imageMap = {
  img1: require('../../assets/img1.png'),
  img2: require('../../assets/img2.png'),
  img3: require('../../assets/img3.png'),
  img4: require('../../assets/img4.png'),
};

export default function Home({ navigation }) {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(productsData);
  }, []);

  const handleAddToCart = (item) => {
    dispatch(addItem(item));
  };

  return (
    <SafeAreaView 
      className="flex-1 bg-white" 
      style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>

      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>

        <View className="py-2 bg-white">
          {/* Header */}
          <View className="flex-row justify-between items-center bg-white px-4">
            <View>
              <Text className="text-xs text-gray-400">Delivery address</Text>
              <TouchableOpacity className="flex-row items-center">
                <Text className="text-sm text-black font-semibold">Salatiga City, Central Java</Text>
                <Image source={require('../../assets/down.png')} className="ml-1 mt-1" />
              </TouchableOpacity>
            </View>

            {/* Right Icons */}
            <View className="flex-row space-x-4">
              <CartIconWithBadge />
              <TouchableOpacity>
                <Image source={require('../../assets/Notification.png')} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <TouchableOpacity className="px-4" onPress={() => navigation.navigate('Search')}>
            <View className="flex-row items-center bg-white border border-gray-300 rounded-md p-3 mt-4 mb-4">
              <Image source={require('../../assets/Search.png')}/>
              <TextInput className="ml-2 flex-1" placeholder="Search here ..." editable={false} />
            </View>
          </TouchableOpacity>

          {/* Banners */}
          <View className="mb-4">
            <FlatList
              horizontal
              data={banners}
              renderItem={({ item }) => (
                <Image 
                  source={item.image} 
                  className="rounded-lg mr-4"
                  style={{ width: width * 0.9, height: width * 0.45 }}
                />
              )}
              keyExtractor={item => item.id}
              showsHorizontalScrollIndicator={false}
            />
          </View>

          {/* Category Section */}
          <View className="mb-4 px-4">
            <Text className="text-lg font-bold mb-4">Category</Text>
            <FlatList
              horizontal
              data={categories}
              renderItem={({ item }) => (
                <TouchableOpacity>
                  <View className="items-center mx-2">
                    <Image source={item.icon} className="w-10 h-10 mb-2" />
                    <Text className="text-sm text-gray-700">{item.title}</Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 10, justifyContent: 'space-between' }}
            />
          </View>

          {/* Recent Products */}
          <View className="flex-row justify-between items-center my-4 px-4">
            <Text className="text-lg font-bold">Recent product</Text>
            <TouchableOpacity className="flex-row items-center border border-gray-300 rounded-md px-3 py-2">
              <Text className="text-gray-700 mr-2">Filters</Text>
              <Image 
                source={require('../../assets/Filter 2.png')} 
                style={{ width: 18, height: 18, tintColor: '#333' }} 
              />
            </TouchableOpacity>
          </View>

          {/* Products */}
          <View className="flex-1 px-4">
            <FlatList
              data={products}
              renderItem={({ item }) => (
                <View 
                  className="bg-white rounded-lg border border-gray-100 flex-1 mx-1 mb-2"
                  style={{ width: (width / 2) - 20 }}
                >
                  <TouchableOpacity onPress={() => navigation.navigate('ProductDetails', { product: item })}>
                    <Image source={imageMap[item.image]} className="w-full h-32 rounded-t-lg" />
                  </TouchableOpacity>

                  <View className="p-3">
                    <Text className="text-sm font-bold mb-1">{item.name}</Text>
                    <Text className="text-sm text-gray-500 mb-2">{item.price}</Text>

                    <TouchableOpacity 
                      className="rounded-md py-2 mt-auto" 
                      style={{ backgroundColor: '#67C4A7' }}
                      onPress={() => handleAddToCart(item)}
                    >
                      <Text className="text-white text-center font-bold">Add to cart</Text>
                    </TouchableOpacity>

                  </View>
                </View>
              )}
              keyExtractor={item => item.id}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              scrollEnabled={false}
            />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
