import { useState } from "react";
import { launchImageLibrary } from "react-native-image-picker";
import { Button, SafeAreaView, ScrollView, View, StyleSheet,Image,Text } from "react-native";
import { recognizeBarcode } from "../mlkit";
import CameraPhoto from "./CameraPhoto";
import { useNavigation } from "@react-navigation/native";

export default function Home({route}){
  const uriCamera=route.params?.uri;
  const navigation=useNavigation();
  const [uri, setUri] = useState('');
  const [response, setResponse] = useState([]);
  const [coord,setCoord]=useState([]);
  const [widthImage,setWidthImage]=useState();
  const ImagePicker = async () => {
    const options = {
      storageOptions: {
        path: 'images',
        mediaType: 'photo',
      },
    };
    await launchImageLibrary(options, res => {
      try {
        if (!res.hasOwnProperty('didCancel')) {
          setUri(res.assets[0].uri || '');
        } else {
          setUri('');
        }

      } catch (e) {
        console.log('Error ImagePicker:', e);
      }
    });
  };
  const processBarcode = async () => {
    if (uri) {
      try {
        const res = await recognizeBarcode(uri);
        if (res.hasOwnProperty('barcodesList')) {
          setResponse(res.barcodesList);
          setCoord(res.barcodesCoord);
          setWidthImage(res.widthImage);
          console.log(res);
        } else {
          setResponse([])
          setCoord([]);
        }
        console.log(res);
      } catch (error) {
        setResponse([]);
        setCoord([]);
        console.log("Error fn processBarcode", error);
      }
    }};


  return(
    <ScrollView>
      <SafeAreaView>
        <View>
          {/*{ (uriCamera.length>0) && (*/}
              <Image style={{aspectRatio: 1, width: '100%'}}
                     source={{uri: uriCamera}}
                     resizeMode="contain"/>
          {/*}*/}
        </View>
        <View style={styles.buttonView}>
          <Button title="GALLERY" onPress={ImagePicker}/>
          <Button title="PROCESS" onPress={processBarcode}/>
          <Button title="CAMERA" onPress={
            ()=>{setUri('');
              navigation.navigate('CameraPhoto');
            }}/>
        </View>
        {response.length > 0 && (
          <View>
            {response.map((el, index) => (
              <Text key={index} style={{
                color: 'green',
                fontSize:20,
                textAlign: 'center',
                margin: 5,
                borderStyle:'solid',
                borderWidth:2,
                padding: 2,
              }}>{el}</Text>
            ))}
          </View>
        )}
      </SafeAreaView>
    </ScrollView>
  );
}
const styles= StyleSheet.create({
  buttonView:{
    flex: 3,
    display: 'flex',
    alignItems:'center',
    flexDirection:'row',
    justifyContent:'space-around',
    paddingTop:30,
  }
})
