import React, { useCallback, useContext, useState } from 'react';
import { View, Text, ScrollView, Button, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OrderCard from '../../Shared/OrderCard';
import EasyButton from '../../Shared/StyledComponents/EasyButton';

import axios from 'axios';
import baseURL from '../../assets/common/baseUrl';

import AuthGlobal from '../../Context/store/AuthGlobal';
import { logoutUser } from '../../Context/actions/Auth.actions';

const UserProfile = ({ navigation }) => {
  const context = useContext(AuthGlobal);

  const [userProfile, setUserProfile] = useState();
  const [orders, setOrders] = useState();

  useFocusEffect(
    useCallback(() => {
      if (
        context.stateUser.isAuthenticated === false ||
        context.stateUser.isAuthenticated === null
      ) {
        navigation.navigate('Login');
      }

      AsyncStorage.getItem('jwt')
        .then((res) => {
          axios
            .get(`${baseURL}users/${context.stateUser.user.userId}`, {
              headers: { Authorization: `Bearer ${res}` },
            })
            .then((user) => setUserProfile(user.data));
        })
        .catch((error) => console.log(error));

      axios
        .get(`${baseURL}orders`)
        .then((x) => {
          const data = x.data;
          const userOrders = data.filter(
            (order) => order.userId === context.stateUser.user.sub
          );
          setOrders(userOrders);
        })
        .catch((error) => console.log(error));

      return () => {
        setUserProfile();
        setOrders();
      };
    }, [context.stateUser.isAuthenticated])
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.subContainer}>
        <Text style={{ fontSize: 30 }}>
          {userProfile ? userProfile.name : ''}
        </Text>
        <View style={{ marginTop: 20 }}>
          <Text style={{ margin: 10 }}>
            Email: {userProfile ? userProfile.email : ''}
          </Text>
          <Text style={{ margin: 10 }}>
            Phone: {userProfile ? userProfile.phone : ''}
          </Text>
        </View>
        <View style={{ marginTop: 80 }}>
          <EasyButton
            medium
            secondary
            onPress={() => [
              AsyncStorage.removeItem('jwt'),
              logoutUser(context.dispatch),
            ]}
          >
            <Text style={{ color: 'white' }}>Sign Out</Text>
          </EasyButton>
        </View>
        <View style={styles.order}>
          <Text style={{ fontSize: 20 }}>My Orders</Text>
          <View>
            {orders ? (
              orders.map((x) => {
                return <OrderCard key={x.id} {...x} />;
              })
            ) : (
              <View style={styles.order}>
                <Text>You have no orders</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  subContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  order: {
    marginTop: 20,
    marginBottom: 80,
    alignItems: 'center',
  },
});

export default UserProfile;
