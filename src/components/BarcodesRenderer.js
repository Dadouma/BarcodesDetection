import {StyleSheet, View} from "react-native";
import Cadre from "./Cadre";

const  BarcodesRenderer = ({response,scale})=> {
  console.log(response);
  return (
    <View style={StyleSheet.absoluteFillObject}>
      {response.map((arr) =>{
        return <Cadre array ={arr} scale={scale}/>
      })
      }
    </View>
  )
}
export default BarcodesRenderer;
