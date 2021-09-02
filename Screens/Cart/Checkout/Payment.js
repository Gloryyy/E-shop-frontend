import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import { Header, Text, Button } from 'native-base';
import { Picker } from '@react-native-picker/picker';
import { RadioButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

const methods = [
  { name: 'Cash on Delivery', value: 1 },
  { name: 'Bank Transfer', value: 2 },
  { name: 'Cash Payment', value: 3 },
];

const paymentCards = [
  { name: 'Wallet', value: 1 },
  { name: 'Visa', value: 2 },
  { name: 'MasterCard', value: 3 },
  { name: 'Other', value: 4 },
];

const Payment = (props) => {
  const order = props.route.params;

  const [selected, setSelected] = useState();
  const [card, setCard] = useState();
  return (
    <>
      <View style={{ marginTop: 20, alignItems: 'center' }}>
        <Text style={{ fontWeight: 'bold' }}>Choose your payment method</Text>
      </View>
      <View style={{ marginTop: 20 }}>
        {methods.map((item) => {
          return (
            <ListItem
              key={item.name}
              onPress={() => setSelected(item.value)}
              bottomDivider
            >
              <ListItem.Content>
                <ListItem.Title>{item.name}</ListItem.Title>
                <View>
                  <RadioButton
                    value={selected}
                    status={selected == item.value ? 'checked' : 'unchecked'}
                    onPress={() => setSelected(item.value)}
                  />
                </View>
              </ListItem.Content>
            </ListItem>
          );
        })}
        {selected == 3 ? (
          <Picker
            mode="dropdown"
            iosIcon={<Icon name={'arrow-down'} />}
            style={{ backgroundColor: '#777', color: 'orange', height: 50 }}
            selectedValue={card}
            onValueChange={(x) => setCard(x)}
          >
            {paymentCards.map((c) => {
              return <Picker.Item key={c.name} label={c.name} value={c.name} />;
            })}
          </Picker>
        ) : null}
        <View style={{ marginTop: 60, alignSelf: 'center' }}>
          <Button
            onPress={() => props.navigation.navigate('Confirm', { order })}
          >
            Confirm
          </Button>
        </View>
      </View>
    </>
  );
};

export default Payment;
