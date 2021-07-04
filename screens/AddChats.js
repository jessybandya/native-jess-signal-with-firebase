import React,{useLayoutEffect,useState} from 'react'
import { StyleSheet, Text, View,Modal,Alert } from 'react-native'
import { Input } from 'react-native-elements'
import Icon from "react-native-vector-icons/FontAwesome"
import { db } from '../firebase'
import {TextInput,Button} from "react-native-paper";
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'

const AddChats = ({navigation}) => {
    const [input,setInput]= useState("")
    const [imageUrl,setImageUrl]=useState("")
    const [modal,setModal]= useState(false);


    const createChat = async(event) =>{
        event.preventDefault();
        let errors = {};
        if(!input.trim()){
            errors.input=alert(`You can't create a group without a name`);
        }else if(!imageUrl.trim()){
            errors.imageUrl=alert(`Kindly add a temporary group photo`);
        }else{
            await db.collection('chats').add({
                chatName:input,
                chatImage:imageUrl
            }).then(()=>{
                navigation.navigate("Home")
            }).catch((error)=> alert(error))
        }

    }


    const pickFromGallery = async ()=>{
        const {granted} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
         if(granted){
        let data = await ImagePicker.launchImageLibraryAsync({
             mediaTypes:ImagePicker.MediaTypeOptions.Images,
             allowsEditing:true,
             aspect:[1,1],
             quality:0.5
         })
         if(!data.cancelled){
          let newFile = {uri:data.uri,
          type:`test/${data.uri.split(".")[1]}`,
          name:`test.${data.uri.split(".")[1]}`}
         handleUpload(newFile) 
      }
         }else{
         Alert.alert("You need to give us permission to your phone")
         }
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
              handleUpload(newFile) 
           }
           }else{
           Alert.alert("You need to give us permission to your phone")
           }
          }
      
          const handleUpload = (image)=>{
              const data = new FormData()
              data.append('file',image)
              data.append('upload_preset','employeeApp')
              data.append("cloud_name","dtmddq4dw")
      
              fetch("https://api.cloudinary.com/v1_1/dtmddq4dw/image/upload",{
                  method:"post",
                  body:data,
      
              }).then(res=>res.json())
              .then(data=>{
                  setImageUrl(data.url)
                  setModal(false)
              }).catch(err=>{
                  Alert.alert("Something went wrong")
              })
          }

    useLayoutEffect(()=>{
        navigation.setOptions({
             title: "Add a new chat",
             headerBackTitle: "Chats"
        });
       },[navigation])
    return (
        <View style={styles.container}>
             <StatusBar  style="light"/>

            <Input 
            placeholder="Enter chat name"
            value={input}
            onChangeText={(text)=> setInput(text)}
            // onSubmitEditing={createChat}
            leftIcon={
              <Icon name="wechat" type="antdesign" size={24} color="#FF1493"/>
            }

            />
            <Button 
        icon={imageUrl==""?"upload":"check"}
        style={styles.button}
         mode="contained"
         onPress={() => setModal(true)} 
        >
            Group Photo
        </Button>
            <Button
        style={styles.button1}
         mode="contained"
         onPress={createChat} 
        >
            Create new Chat
        </Button>
        <Modal
        animationType="slide"
        transparent={true}
        visible={modal}
        onRequestClose={()=>{
            setModal(false)
        }}
        >
       <View style={styles.modalView}>
           <View style={styles.modalButtonView}>
           <Button 
        icon="camera"
        style={{backgroundColor:"#FF1493"}}
         mode="contained" 
         onPress={() => pickFromCamera()} 
        >
            Camera
        </Button>
        <Button 
        icon="image-area"
        style={{backgroundColor:"#FF1493"}}
        mode="contained" 
        onPress={() => pickFromGallery()} 
        >
            Gallery
        </Button>
           </View>
       <Button 
       
        onPress={() => setModal(false)} 
        >
            <Text style={{color:"#FF1493",fontSize:15}}>Cancel</Text>
        </Button>
       </View>
        </Modal>       
        </View>
    )
}

export default AddChats

const styles = StyleSheet.create({
    container:{
        backgroundColor:"white",
        padding:30,
        height:"100%"
    },
    button:{
     width:300,
     marginTop:-15,
     backgroundColor:"#FF1493",
    },
    button1:{
     width:300,
     marginTop:50,
     backgroundColor:"#FF1493",
    },
    modalView:{
     position: "absolute",
     bottom:2,
     width:"100%",
     backgroundColor:"#fff"
 },
 modalButtonView:{
     flexDirection:"row",
     justifyContent:"space-around",
     padding:10
 },
})
