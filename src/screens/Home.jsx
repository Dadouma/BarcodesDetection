import { useEffect, useState } from "react";
import { launchImageLibrary } from "react-native-image-picker";
import { Button, SafeAreaView, ScrollView, View, StyleSheet, Image, Text, useWindowDimensions } from "react-native";
import { recognizeBarcode } from "../mlkit";
import CameraPhoto from "./CameraPhoto";
import { useNavigation } from "@react-navigation/native";
import BarcodesRenderer from "../components/BarcodesRenderer";

export default function Home({route}){
  const receivedData=route.params?.uri;
  const[uriCamera,setUriCamera]=useState('');
  const navigation=useNavigation();
  const [uri, setUri] = useState('');
  const [response, setResponse] = useState([]);
  const [coord,setCoord]=useState([]);
  /////////////////
  const [aspectRatio, setAspectRatio] = useState(1);
  const windowDimensions = useWindowDimensions();
  const [widthImage,setWidthImage]=useState(500);
  ////////////////////////////
  useEffect(() => {
      setUriCamera(receivedData);
      setUri('');
  }, [receivedData]);
  //////
  useEffect(() => {
    setAspectRatio(windowDimensions.width/widthImage  )
  }, [uri])
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
          setUriCamera('');
        } else {
          setUri('');
        }

      } catch (e) {
        console.log('Error ImagePicker:', e);
      }
    });
  };
  const processBarcode = async (url) => {
    try {
      const res = await recognizeBarcode(url);
      if (res.hasOwnProperty('barcodesList')) {
        setResponse(res.barcodesList);
        setCoord(res.barcodesCoord);
        setWidthImage(res.widthImage);
      } else {
        setResponse([]);
        setCoord([]);
      }
      console.log(res);
    } catch (error) {
      setResponse([]);
      setCoord([]);
      console.log("Error in processBarcode", error);
    }
  };

  const processBothBarcodes = async () => {
    if (uri) {
      await processBarcode(uri);
    }
    if (uriCamera) {
      await processBarcode(uriCamera);
    }
  };


  return(
    <ScrollView>
      <SafeAreaView style={{flex: 1, justifyContent: 'center', flexDirection: 'column'}}>
        <View style={{aspectRatio:1 , width: windowDimensions.width}}>
          { (uri || uriCamera) &&(
          <Image
            style={{ aspectRatio: 1, width: '100%'}}
            source={{ uri: uri.length > 0 ? uri : uriCamera }}
            resizeMode="contain"
          />)}
          {coord.length > 0 && (
            <BarcodesRenderer response={coord} scale={aspectRatio} />
          )}
        </View>
        <View style={styles.buttonView}>
          <Button title="GALLERY" onPress={ImagePicker}/>
          <Button title="PROCESS" onPress={processBothBarcodes}/>
          <Button title="CAMERA" onPress={
            ()=>{setUri('');
              navigation.navigate('CameraPhoto');
            }}/>
        </View>
        {response.length > 0 && (
          <View style={{flex: 3, flexWrap:'wrap', width:windowDimensions.width}}>
            {response.map((el) => (
              <Text style={{
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
