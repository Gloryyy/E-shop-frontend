import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';

const CartItem = (props) => {
  const data = props.item.item;
  const [quantity, setQuantity] = useState(props.item.quantity);

  return (
    <ListItem style={styles.listItem} key={Math.random()} bottomDivider>
      <Avatar
        source={{
          uri: data.image
            ? data.image
            : 'https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png',
        }}
      />
      <ListItem.Content style={styles.body}>
        <ListItem.Title>{data.name}</ListItem.Title>
        <ListItem.Subtitle>$ {data.price}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

const styles = StyleSheet.create({
  listItem: {
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  body: {
    margin: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default CartItem;
