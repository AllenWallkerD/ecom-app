import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Platform, StatusBar, Image, SafeAreaView } from 'react-native';
import CartIconWithBadge from '../components/cart/CartIconWithBadge';
import productsData from '../../lib/products.json';
import { useDispatch } from 'react-redux'; 
import { addItem } from '../redux/cartSlice';

const imageMap = {
  img1: require('../../assets/img1.png'),
  img2: require('../../assets/img2.png'),
  img3: require('../../assets/img3.png'),
  img4: require('../../assets/img4.png'),
};

export default function Search({ navigation }) {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);

  const handleAddToCart = (item) => {
    dispatch(addItem(item));
  };

  const filterProducts = (text) => {
    if (text.length > 0) {
      const filtered = productsData.filter(product =>
        product.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  };

  const handleSearchTextChange = (text) => {
    setSearchText(text);
    filterProducts(text);
  };

  const handleSearchSubmit = () => {
    if (searchText.length > 0 && !recentSearches.includes(searchText)) {
      setRecentSearches([searchText, ...recentSearches]);
    }
  };

  const handleClearAll = () => {
    setRecentSearches([]);
  };

  const handleSearchItem = (item) => {
    setSearchText(item);
    filterProducts(item);
  };

  const handleRemoveSearch = (item) => {
    setRecentSearches(recentSearches.filter(search => search !== item));
  };

  return (
    <SafeAreaView 
      className="flex-1 bg-white" 
      style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>

      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View className="flex-1 bg-white" style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
        
        {/* Top Bar */}
        <View className="flex-row items-center px-3 mb-3">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={require('../../assets/arrow.png')} />
          </TouchableOpacity>

          {/* Search Bar */}
          <View className="flex-row items-center bg-white border border-gray-300 rounded-md p-3 mx-3 flex-1">
            <Image source={require('../../assets/Search.png')} />
            <TextInput
              className="ml-2 flex-1"
              placeholder="Search here..."
              value={searchText}
              onChangeText={handleSearchTextChange}
              onSubmitEditing={handleSearchSubmit}
            />
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Image source={require('../../assets/close_icon.png')} />
            </TouchableOpacity>
          </View>

          <CartIconWithBadge />
        </View>

        {/* Recent Searches */}
        {!searchText && (
          <View className="px-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-lg font-bold">Last search</Text>
              <TouchableOpacity onPress={handleClearAll}>
                <Text className="text-red-500">Clear all</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={recentSearches}
              renderItem={({ item }) => (
                <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
                  <TouchableOpacity onPress={() => handleSearchItem(item)} className="flex-row items-center flex-1">
                    <Image 
                      source={require('../../assets/Time Circle.png')} 
                      style={{ width: 23, height: 23 }} 
                    />
                    <Text style={{ marginLeft: 10 }}>{item}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleRemoveSearch(item)}>
                    <Image source={require('../../assets/close_icon.png')} />
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        )}

        {/* Search Results */}
        {searchText && (
          <View className="px-3">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-bold">Search result for "{searchText}"</Text>
              <TouchableOpacity>
                <Text className="text-gray-500">Filters</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={filteredProducts}
              renderItem={({ item }) => (
                <View className="bg-white rounded-lg border border-gray-100 flex-1 mx-1 mb-2" style={{ width: '48%' }}>
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
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
