import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { VStack, Input, Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
//import Icon from 'react-native-vector-icons/Ionicons';
import baseURL from '../../assets/common/baseUrl';
import axios from 'axios';
import Banner from '../../Shared/Banner';
import ProductList from './ProductList';
import SearchedProduct from './SearchedProducts';
import CategoryFilter from './CategoryFilter';

const data = require('../../assets/data/products.json');
const productsCategories = require('../../assets/data/categories.json');

var { height } = Dimensions.get('window');

const ProductContainer = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [productsFiltered, setProductsFiltered] = useState([]);
  const [focus, setFocus] = useState();
  const [categories, setCategories] = useState([]);
  const [productsCtg, setProductsCtg] = useState([]);
  const [active, setActive] = useState();
  const [initialState, setInitialState] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setFocus(false);
      setActive(-1);

      // Products
      axios
        .get(`${baseURL}products`)
        .then((res) => {
          setProducts(res.data);
          setProductsFiltered(res.data);
          setProductsCtg(res.data);
          setInitialState(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log('Api call error');
        });

      // Categories
      axios
        .get(`${baseURL}categories`)
        .then((res) => {
          setCategories(res.data);
        })
        .catch((error) => {
          console.log('Api call error');
        });

      return () => {
        setProducts([]);
        setProductsFiltered([]);
        setFocus();
        setCategories([]);
        setActive();
        setInitialState();
      };
    }, [])
  );

  const searchProduct = (text) => {
    setProductsFiltered(
      products.filter((i) => i.name.toLowerCase().includes(text.toLowerCase()))
    );
  };

  const openList = () => {
    setFocus(true);
  };

  const onBlur = () => {
    setFocus(false);
  };

  // Categories
  const changeCtg = (ctg) => {
    {
      ctg === 'all'
        ? [setProductsCtg(initialState), setActive(true)]
        : [
            setProductsCtg(
              products.filter((i) => i.category._id === ctg),
              setActive(true)
            ),
          ];
    }
  };

  return (
    <>
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
            onFocus={openList}
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
              <Icon
                m={2}
                size={5}
                onPress={onBlur}
                as={<Ionicons name="ios-close" />}
              />
            }
          />
        </VStack>
      </VStack>
      {focus == true ? (
        <SearchedProduct
          navigation={navigation}
          productsFiltered={productsFiltered}
        />
      ) : (
        <ScrollView>
          <View>
            <Banner />
          </View>

          <View>
            <CategoryFilter
              categories={categories}
              categoryFilter={changeCtg}
              productsCtg={productsCtg}
              active={active}
              setActive={setActive}
            />
          </View>
          {productsCtg.length > 0 ? (
            <View style={styles.listContainer}>
              {productsCtg.map((item) => {
                return (
                  <ProductList
                    navigation={navigation}
                    key={item.name}
                    item={item}
                  />
                );
              })}
            </View>
          ) : (
            <View style={[styles.center, { height: height / 2 }]}>
              <Text>No products found</Text>
            </View>
          )}
          {loading ? (
            <View
              style={{
                ...StyleSheet.absoluteFill,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ActivityIndicator size="large" color="red" />
            </View>
          ) : null}
        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    height: '100%',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    backgroundColor: 'gainsboro',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProductContainer;

{
  /* <Container>
      <View style={styles.inputContainer}>
        <Icon name="ios-search" style={{ fontSize: 24 }} />
        <TextInput
          placeholder="Search"
          style={styles.input}
          onFocus={openList}
          onChangeText={(text) => searchProduct(text)}
        />
      </View>

      {focus == true ? (
        <SearchedProduct productsFiltered={productsFiltered} />
      ) : (
        <View>
          <Text>Product Container</Text>
          <View style={styles.listContainer}>
            <FlatList
              numColumns={2}
              data={products}
              renderItem={({ item }) => <ProductList item={item} />}
              keyExtractor={(item) => item.brand}
            />
          </View>
        </View>
      )}
    </Container> */
}
