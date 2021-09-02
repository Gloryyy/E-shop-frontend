import { Platform } from 'react-native';

let baseURL = '';

{
  Platform.OS == 'android'
    ? (baseURL =
        'http://6102-2a01-c23-752b-be00-3484-f495-ddc1-446b.ngrok.io/api/v1/')
    : (baseURL = 'http://localhost:3000/api/v1/');
}

export default baseURL;