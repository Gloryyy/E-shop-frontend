import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import FormContainer from '../../Shared/Form/FormContainer';
import Input from '../../Shared/Form/Input';
import Error from '../../Shared/Error';
import EasyButton from '../../Shared/StyledComponents/EasyButton';
import Toast from 'react-native-toast-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import baseURL from '../../assets/common/baseUrl';

const Register = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const register = () => {
    if (email === '' || name === '' || phone === '' || password === '') {
      setError('Please fill in your credentials');
    }
    let user = {
      name,
      email,
      password,
      phone,
      isAdmin: false,
    };
    axios
      .post(`${baseURL}users/register`, user)
      .then((res) => {
        if (res.status == 200) {
          Toast.show({
            topOffset: 60,
            type: 'success',
            text1: 'Registration Succeeded',
            text2: 'Please login into your account',
          });
          setTimeout(() => {
            navigation.navigate('Login');
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
    <KeyboardAwareScrollView
      viewIsInsideTabBar={true}
      extraHeight={200}
      enableOnAndroid={true}
    >
      <FormContainer title={'Register'}>
        <Input
          placeholder="Email"
          name="email"
          id="email"
          value={email}
          onChangeText={(text) => setEmail(text.toLowerCase())}
        />
        <Input
          placeholder="Name"
          name="name"
          id="name"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <Input
          placeholder="Phone"
          name="phone"
          id="phone"
          value={phone}
          keyboardType="numeric"
          onChangeText={(text) => setPhone(text)}
        />
        <Input
          placeholder="Password"
          name="password"
          id="password"
          value={password}
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
        />
        <View style={styles.buttonGroup}>
          {error ? <Error message={error} /> : null}
        </View>
        <EasyButton primary large onPress={() => register()}>
          <Text style={{ color: 'white' }}>Register</Text>
        </EasyButton>
        <EasyButton
          secondary
          large
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={{ color: 'white' }}>Back to Login</Text>
        </EasyButton>
      </FormContainer>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  buttonGroup: {
    width: '80%',
    margin: 10,
    alignItems: 'center',
  },
});

export default Register;
