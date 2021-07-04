import React,{useLayoutEffect,useState,useEffect} from 'react'
import { ScrollView,SafeAreaView } from 'react-native'
import { View, Text,StyleSheet,Image } from 'react-native'
import CustomListItem from '../components/CustomListItem'
import { Avatar } from 'react-native-elements'
import { auth,db } from '../firebase'
import { TouchableOpacity } from 'react-native'
import {AntDesign, SimpleLineIcons} from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'

const Home = ({navigation}) => {

    const [chats, setChats] = useState([])


     if(!auth.currentUser){
         navigation.navigate("Login")
     }

     useEffect(()=>{
       const unsuscribe = db.collection('chats').onSnapshot(snapshot =>{
          setChats(snapshot.docs.map(doc =>({
              id:doc.id,
              data:doc.data()
          })))
       })
       return unsuscribe
     },[])
    const signOut = () =>{
        auth.signOut()
        .then(()=> {
            navigation.replace('Login')
        })
    }

      useLayoutEffect(() => {
          navigation.setOptions({
              title:"Jess_signaL",
              headerStyle : {
                  backgroundColor: "#fff",
              },
             
              
            headerTitleStyle: {color: "#FF1493"},
            headerTintColor: "#FF1493",
            headerLeft: ()=>
               <View style={{ marginLeft: 20,alignItems:"center",flexDirection:"row"}}>
                   <TouchableOpacity onPress={signOut} activeOpacity={0.5}>
                       <View>
                       <Avatar rounded source={{ uri:auth?.currentUser?.photoURL}}/>
                       <Text style={{color:"#FF1493"}}>{auth?.currentUser?.displayName}</Text>
                       </View>

                  </TouchableOpacity>              
               </View>,
               
              headerRight: ()=>
                  <View style={{
                      flexDirection:"row",
                      justifyContent:"space-between",
                      width: 80,
                      marginRight:20
                  }}>
                   <TouchableOpacity activeOpacity={0.5}>
                       {/* <AntDesign name="camerao" size={24} onPress={() => alert("Still under development mode!!!")} color="#FF1493" /> */}
                       <Image style={{height:28,width:28}} source={{uri: "data:image/webp;base64,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"}}/>
                   </TouchableOpacity>
                   <TouchableOpacity onPress={()=> navigation.navigate("AddChats")} activeOpacity={0.5}>
                       <SimpleLineIcons name="pencil" size={24} color="#FF1493" />
                   </TouchableOpacity>
                  </View>
            
          })

      }, [navigation])

 const enterChat = (id,chatName) =>{
    navigation.navigate("Chat",{
        id,
        chatName
    })
 }


 const pickFromCamera = async ()=>{
    const {granted} = await Permissions.askAsync(Permissions.CAMERA)
     if(granted){
    let data = await ImagePicker.launchCameraAsync({
         mediaTypes:ImagePicker.MediaTypeOptions.Images,
         allowsEditing:true,
         aspect:[1,1],
         quality:0.5
     })
     if(!data.cancelled){
         let newFile = {uri:data.uri,
         type:`test/${data.uri.split(".")[1]}`,
         name:`test.${data.uri.split(".")[1]}`}
     }
     }else{
     Alert.alert("You need to give us permission to your phone")
     }
    }
    return (
        <SafeAreaView>
                       <StatusBar  style="#FF1493"/>

            <ScrollView style={styles.container}>
            {chats.map(({ id,data: {chatName,chatImage}})=>(
                <CustomListItem key={id} id={id} chatName={chatName} chatImage={chatImage} enterChat={enterChat}/>
            ))}
                
            </ScrollView>
        </SafeAreaView>
    )
}

export default Home

const styles = StyleSheet.create({
    container:{
       height: "100%" 
    }
})