import React,{useLayoutEffect, useState,useEffect} from 'react'
import { TouchableOpacity } from 'react-native'
import { StyleSheet, Text, View,KeyboardAvoidingView } from 'react-native'
import { Avatar } from 'react-native-elements'
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native'
import { ScrollView,TextInput } from 'react-native'
import { Keyboard,TouchableWithoutFeedback } from 'react-native'
import { db,auth } from '../firebase'
import  firebase from 'firebase'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'

// import { TouchableWithoutFeedback } from "react-native-gesture-handler"

const ChatScreen = ({ navigation,route }) => {
    const [input,setInput] = useState("")
    const [messages,setMessages] = useState([])


    const sendMessage = (event) =>{
      Keyboard.dismiss()
      event.preventDefault();
        let errors = {};
        if(!input.trim()){
            errors.input=alert(`You can't send with an empty field text`);
        }else{
            db.collection('chats').doc(route.params.id).collection('messages').add({
                timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                message:input,
                displayName: auth?.currentUser?.displayName,
                email: auth?.currentUser?.email,
                photoURL: auth?.currentUser?.photoURL
         })
         setInput("")
        }
      
    }

    useLayoutEffect(()=>{
        const unsubscribe = db.collection('chats').doc(route.params.id).
        collection('messages').orderBy('timestamp','asc').onSnapshot((snapshot) => setMessages(
            snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            }))
        ))
        return unsubscribe
    },[route])



    useLayoutEffect(()=>{
      navigation.setOptions({
          title: "Chat",
          headerTitleAlign: "left",
          headerBackTitleVisible: false,
          headerTitle: ()=>
          <View style={{
              flexDirection:"row",
              alignItems: "center"
          }}>
             <Avatar rounded source={{uri: messages[0]?.data?.photoURL}}/>
             <Text style={{ color: "white", marginLeft:10, fontWeight: "700"}}>{route.params.chatName}</Text>
          </View>,

          headerLeft: () =>
               <TouchableOpacity 
               style={{ marginLeft:10 }} 
               onPress={navigation.goBack}
               activeOpacity={0.5}>
                      <AntDesign name="arrowleft" size={24} color="white"/>
               </TouchableOpacity>,
        headerRight: () =>
               <View style={{
                   flexDirection:"row",
                   justifyContent: "space-between",
                   width:80,
                   marginRight:20
               }}>
                   <TouchableOpacity>
                       <FontAwesome name="video-camera" size={24} color="white" onPress={() => alert("Still under development mode!!!")}/>
                   </TouchableOpacity>
                   <TouchableOpacity>
                       <Ionicons name="call" size={24} color="white" onPress={() => alert("Still under development mode!!!")}/>
                   </TouchableOpacity>
               </View>
          
      })
    },[navigation,messages])


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
        <SafeAreaView style={{ flex:1, backgroundColor: "white"}}>
           <StatusBar  style="light"/>
           <TouchableWithoutFeedback >
           <KeyboardAvoidingView
           behavior={Platform.OS === "ios" ? "padding" : "height"}
           style={styles.container}
           keyboardVerticalOffset={90}
           >
            <>
            <ScrollView>
              {messages.map(({id, data})=>(
                  data.email === auth?.currentUser?.email ? (
                         <View key={id} style={styles.sender}>
                        <Avatar
                        size={32}
                        position="absolute"
                        bottom={-15}
                        right={-5}
                        //Web
                        containerStyle={{
                            position:"absolute",
                            bottom: -15,
                            right:-5
                        }}
                        rounded
                        source = {{uri: data.photoURL}} 
                        />
                        <Text style={styles.senderText}>{data.message}</Text>
                        {/* <Text style={styles.senderName}>Me</Text>   */}

                         </View>
                  ):(
                         <View key={id} style={styles.receiver}>
                            <Avatar 
                      size={32}
                      position="absolute"
                      bottom={-15}
                      left={-5}
                      //Web
                      containerStyle={{
                          position:"absolute",
                          bottom: -15,
                          left:-5
                      }}
                      rounded
                      source = {{uri: data.photoURL}} 
                            />
                        <Text style={styles.receiverText}>{data.message}</Text> 
                        <Text style={styles.receiverName}>{data.displayName}</Text>  
                         </View>
                  )
              ))}              
            </ScrollView>
            <View style={styles.footer}>
               <TextInput 
               placeholder="Jess_signaL message..."
               style={styles.textInput}
               value={input}
               onChangeText={(text)=> setInput(text)}
               />
               <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
                 <Ionicons name="send" size={24} color="#ff2199"/>
               </TouchableOpacity>
            </View>

            </>
           </KeyboardAvoidingView>
           </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

export default ChatScreen

const styles = StyleSheet.create({
    container:{
      flex:1
    },
    senderName:{
      color:"#ff2199",
      fontSize:10,
      marginRight:-10

    },
    receiverText:{
        color: "white",
        fontWeight:"800",
        marginBottom: 15,
        marginLeft: 15,

    },
    receiverName:{
        fontSize:8,
       color: "white"
    },
    footer:{
      flexDirection:"row",
      alignItems: "center",
      width: "100%",
      padding: 15
    },
    textInput:{
       bottom:0,
       height:40,
       flex:1,
       marginRight:15,
    //    borderColor: "transparent",
       backgroundColor: "#ECECEC",
       padding:10,
       color: "grey",
       borderRadius: 30,
    },
    receiverText:{
      color:"white"
    },
    senderText:{
        color: "#ff2199"
    },
    sender:{
   padding:15,
   backgroundColor: "#ECECEC",
   alignSelf: "flex-end",
   borderRadius: 20,
   marginRight: 15,
   marginBottom: 20,
   maxWidth: "80%",
   position: "relative"
    },
    receiver:{
        padding:15,
        backgroundColor: "#ff2199",
        alignSelf: "flex-start",
        borderRadius: 20,
        marginLeft: 15,
        marginBottom: 20,
        maxWidth: "80%",
        color:"white",
        position: "relative"
    } 
})
