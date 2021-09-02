import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Input, VStack } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';
import ListItem from './ListItem';

import axios from 'axios';
import baseURL from '../../assets/common/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EasyButton from '../../Shared/StyledComponents/EasyButton';

var { height, width } = Dimensions.get('window');

const ListHeader = () => {
  return (
    <View elevation={1} style={styles.listHeader}>
      <View style={styles.headerItem}></View>
      <View style={styles.headerItem}>
        <Text style={{ fontWeight: '700' }}>Brand</Text>
      </View>
      <View style={styles.headerItem}>
        <Text style={{ fontWeight: '700' }}>Name</Text>
      </View>
      <View style={styles.headerItem}>
        <Text style={{ fontWeight: '700' }}>Category</Text>
      </View>
      <View style={styles.headerItem}>
        <Text style={{ fontWeight: '700' }}>Price</Text>
      </View>
    </View>
  );
};

const Products = ({ navigation }) => {
  const [productList, setProductList] = useState();
  const [productFilter, setProductFilter] = useState();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState();

  useFocusEffect(
    useCallback(() => {
      // Get Token
      AsyncStorage.getItem('jwt')
        .then((res) => {
          setToken(res);
        })
        .catch((err) => console.log(err));

      axios.get(`${baseURL}products`).then((res) => {
        setProductList(res.data);
        setProductFilter(res.data);
        setLoading(false);
      });

      return () => {
        setProductList();
        setProductFilter();
        setLoading(true);
      };
    }, [])
  );

  const searchProduct = (text) => {
    if (text == '') {
      setProductFilter(productList);
    }
    setProductFilter(
      productList.filter((i) =>
        i.name.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  const deleteProduct = (id) => {
    axios
      .delete(`${baseURL}products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const products = productFilter.filter((item) => item.id !== id);
        setProductFilter(products);
      })
      .catch((err) => console.log(err));
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <EasyButton
          secondary
          medium
          onPress={() => navigation.navigate('Orders')}
        >
          <Icon name="shopping-bag" size={18} color="white" />
          <Text style={styles.buttonText}>Orders</Text>
        </EasyButton>
        <EasyButton
          secondary
          medium
          onPress={() => navigation.navigate('ProductForm')}
        >
          <Icon name="plus" size={18} color="white" />
          <Text style={styles.buttonText}>Products</Text>
        </EasyButton>
        <EasyButton
          secondary
          medium
          onPress={() => navigation.navigate('Categories')}
        >
          <Icon name="plus" size={18} color="white" />
          <Text style={styles.buttonText}>Categories</Text>
        </EasyButton>
      </View>
      <View>
        <VStack space={8} width="80%">
          <VStack
            width="100%"
            space={2}
            style={{
              height: 80,
              justifyContent: 'center',
              marginLeft: 40,
            }}
          >
            <Input
              placeholder="Search"
              variant="filled"
              width="100%"
              bg="gray.200"
              borderRadius={10}
              py={2}
              px={2}
              placeholderTextColor="#777"
              onChangeText={(text) => searchProduct(text)}
              _web={{
                _focus: {
                  borderColor: 'muted.300',
                  style: { boxShadow: 'none' },
                },
              }}
              InputLeftElement={
                <Icon
                  m={2}
                  size={5}
                  color="gray"
                  as={<Ionicons name="ios-search" />}
                />
              }
              InputRightElement={
                <Icon m={2} size={5} as={<Ionicons name="ios-close" />} />
              }
            />
          </VStack>
        </VStack>
      </View>

      {loading ? (
        <View style={styles.spinner}>
          <ActivityIndicator size="large" color="red" />
        </View>
      ) : (
        <FlatList
          data={productFilter}
          ListHeaderComponent={ListHeader}
          renderItem={({ item, index }) => (
            <ListItem
              {...item}
              navigation={navigation}
              index={index}
              delete={deleteProduct}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  listHeader: {
    flexDirection: 'row',
    padding: 5,
    backgroundColor: 'gainsboro',
  },
  headerItem: {
    margin: 3,
    width: width / 6,
  },
  spinner: {
    height: height / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    marginBottom: 160,
    backgroundColor: 'white',
  },
  buttonContainer: {
    margin: 20,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    marginLeft: 4,
    color: 'white',
  },
});

export default Products;
