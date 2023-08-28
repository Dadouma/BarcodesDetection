import { useState } from "react";
import { launchImageLibrary } from "react-native-image-picker";
import { Button, SafeAreaView, ScrollView, View, StyleSheet,Image } from "react-native";

export default function Home(){
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
          { (uri.length>0) && (
              <Image style={{aspectRatio: 1, width: '100%'}}
                     source={{uri: uri}}
                     resizeMode="contain"/> )
          }
        </View>
        <View style={styles.buttonView}>
          <Button title="GALLERY" onPress={ImagePicker}/>
          <Button title="PROCESS" onPress={processBarcode}/>
          <Button title="CAMERA" onPress={
            ()=>{setUri('');
            }}/>
        </View>
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
