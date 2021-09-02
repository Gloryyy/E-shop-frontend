import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, ScrollView } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import { connect } from 'react-redux';
import * as actions from '../../../Redux/Actions/cartActions';
import { Text, Button } from 'native-base';
import Toast from 'react-native-toast-message';
import baseURL from '../../../assets/common/baseUrl';
import axios from 'axios';

var { height, width } = Dimensions.get('window');

const Confirm = (props) => {
  const finalOrder = props.route.params;

  const [productUpdate, setProductUpdate] = useState();

  useEffect(() => {
    if (finalOrder) {
      getProducts(finalOrder);
    }
    return () => {
      setProductUpdate();
    };
  }, [props]);

  const getProducts = (x) => {
    const order = x.order.order;
    var products = [];
    if (order) {
      order.orderItems.forEach((cart) => {
        axios
          .get(`${baseURL}products/${cart.product}`)
          .then((data) => {
            products.push(data.data);
            setProductUpdate(products);
          })
          .catch((e) => {
            console.log(e);
          });
      });
    }
  };

  const confirmOrder = () => {
    const order = finalOrder.order.order;

    axios
      .post(`${baseURL}orders`, order)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          Toast.show({
            topOffset: 60,
            type: 'success',
            text1: 'Order Completed',
            text2: '',
          });
          setTimeout(() => {
            props.clearCart();
            props.navigation.navigate('Cart');
          }, 500);
        }
      })
      .catch((error) => {
        Toast.show({
          topOffset: 60,
          type: 'error',
          text1: 'Something went wrong',
          text2: 'Please try again',
        });
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Confirm Order</Text>
        {props.route.params ? (
          <View style={{ borderWidth: 1, borderColor: 'orange' }}>
            <Text style={styles.title}>Shipping to:</Text>
            <View style={{ padding: 8 }}>
              <Text>Address: {finalOrder.order.order.shippingAddress1}</Text>
              <Text>Address2: {finalOrder.order.order.shippingAddress2}</Text>
              <Text>City: {finalOrder.order.order.city}</Text>
              <Text>Zip Code: {finalOrder.order.order.zip}</Text>
              <Text>Country: {finalOrder.order.order.country}</Text>
            </View>
            <Text style={styles.title}>Items:</Text>

            {productUpdate && (
              <>
                {productUpdate.map((x) => {
                  return (
                    <ListItem
                      key={x.name}
                      style={styles.listItem}
                      bottomDivider
                    >
                      <View style={styles.body}>
                        <Avatar source={{ uri: x.image }} />
                        <Text>{x.name}</Text>
                        <Text>$ {x.price}</Text>
                      </View>
                    </ListItem>
                  );
                })}
              </>
            )}
          </View>
        ) : null}
        <View style={{ alignItems: 'center', margin: 20 }}>
          <Button onPress={confirmOrder}>Place order</Button>
        </View>
      </View>
    </ScrollView>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearCart: () => dispatch(actions.clearCart()),
  };
};

const styles = StyleSheet.create({
  container: {
    height: height,
    padding: 8,
    alignContent: 'center',
    backgroundColor: 'white',
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
  },
  title: {
    alignSelf: 'center',
    margin: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  listItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width / 1.1,
  },
  body: {
    margin: 15,
    alignItems: 'center',
    flexDirection: 'row',
    width: 310,
    justifyContent: 'space-around',
  },
});

export default connect(null, mapDispatchToProps)(Confirm);
