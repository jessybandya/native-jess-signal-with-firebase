import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Login from "./screens/Login"
import { createStackNavigator } from '@react-navigation/stack';
import Register from './screens/Register';
import Home from './screens/Home';
import AddChats  from './screens/AddChats';
import ChatScreen from './screens/ChatScreen';
const Stack = createStackNavigator();
const myOptions ={
  title:"Home",
  headerTintColor:"white",
  headerStyle:{
    backgroundColor:"#3399ff",
  }
  
}
const globalScreenOptions = {
  headerStyle:{
    backgroundColor:"#FF1493",
  },
  headerTitleStyle: {color: "white",
  
},
  headerTintColor: "white",
  headerTitleAlign: 'center'
}

export default function App() {
  return (
    <NavigationContainer >
         <Stack.Navigator 
         initialRouteName="Home"
         screenOptions={globalScreenOptions}>

         <Stack.Screen name="Login" component={Login}/>
         <Stack.Screen name="Register" component={Register} />
         <Stack.Screen name="Home" component={Home} />
         <Stack.Screen name="AddChats" component={AddChats} />
         <Stack.Screen name="Chat" component={ChatScreen} />


         </Stack.Navigator>
       </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
