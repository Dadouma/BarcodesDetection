import {View} from "react-native";

const Cadre =({array,scale})=>{
  return( <View
      style={{
        position: 'absolute',
        borderWidth: 1,
        borderColor: 'red',
        left: array[0]*0.09,
        top: array[1]*0.09,
        height: array[2]*0.09,
        width: array[3]*0.09}}
    />

  )}
export default Cadre;
