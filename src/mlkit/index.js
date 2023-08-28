import {NativeModules} from 'react-native';

const {BarcodeModule} = NativeModules;
export const recognizeBarcode=(uri)=>{
  return BarcodeModule.recognizeBarcode(uri);
}

