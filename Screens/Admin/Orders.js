import React, { useState, useCallback } from 'react';
import { View, FlatList, Text } from 'react-native';
import baseURL from '../../assets/common/baseUrl';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import OrderCard from '../../Shared/OrderCard';

const Orders = ({ navigation }) => {
  const [orderList, setOrderList] = useState();

  useFocusEffect(
    useCallback(() => {
      getOrders();
      return () => {
        setOrderList();
      };
    }, [])
  );

  const getOrders = () => {
    axios
      .get(`${baseURL}orders`)
      .then((x) => {
        setOrderList(x.data);
      })
      .catch((error) => console.log(error));
  };

  return (
    <View>
      <FlatList
        data={orderList}
        renderItem={({ item }) => (
          <OrderCard navigation={navigation} {...item} editMode={true} />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default Orders;
