import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  Switch
} from 'react-native';
import { Button } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import { useDispatch, useSelector } from 'react-redux';
import imagePicker from 'react-native-image-picker';
import Axios from 'axios';
import { AuthLogout } from '../../redux/actions/Auth';
import { GetUser, PatchPhoto} from '../../redux/actions/User';


const Profile = ({navigation}) => {
  
  
  const [photo, setPhoto] = React.useState(null)
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  const [button, setButton] = React.useState('Save');
  const [selectUser, setSelectUser] = React.useState({});
  const dispatch = useDispatch()
  const sheetRef = React.useRef(null);
  const down = new Animated.Value(1);
  
  const Auth = useSelector((s)=> s.Auth)
  const { data } = useSelector((s)=> s.User)
  
  
  console.log(Auth.data.token, 'll')

  React.useEffect(()=> {
    
      dispatch(GetUser({
        id: Auth.data.token.id,
        token: Auth.data.token.token
      }));
    console.log(data, 'mm')
  }, []);

  const uploadImage = () => {
    imagePicker.showImagePicker({}, (response) => {
      if (response.didCancel || response.error) {
        alert("You haven't selected a image");
      } else {
        const formData = new FormData();
        formData.append('photo', {
          uri: response.uri,
          name: response.fileName,
          type: response.type,
        });

        const header = {
          headers: {
            'auth-token': `${Auth.data.token.token}`,
            'Content-Type': 'multipart/form-data',
            Accept: 'application/json',
          },
        };
        Axios.patch(
          `https://db-zwallet.herokuapp.com/api/change_photo/${Auth.data.token.id}`,
          formData,
          header,
        )
          .then((response) => {
            console.log('upload succes', response);
            ToastAndroid.show(
              `upload successful`,
              ToastAndroid.SHORT,
          );
          })
          .catch((error) => {
            console.log('upload error', error);
            ToastAndroid.show(
              `upload failed`,
              ToastAndroid.SHORT,
          );
          });
      }
    });
  };

  const onLogout = () => {
    dispatch(AuthLogout());
  };

  // const renderHeader = () => (
  //   <View style={style.header}>
  //     <View style={style.panelHeader}>
  //       <View style={style.panelHandle} />
  //     </View>
  //   </View>
  // );

  // const takePhotoFromCamera = () => {
  //   ImagePicker.launchCamera(
  //     { mediaType: 'photo' },
  //     (res) => {
  //       const photo = new FormData();
  //       photo.append('images', {
  //         uri: res.uri,
  //         type: res.type,
  //         name: res.fileName,
  //       });
  //       dispatch(PatchPhoto({
  //         id: Auth.data.token.id,
  //         token: Auth.data.token.token,
  //         photo: photo
  //       }));
  //     },
  //   );
  // };

  // const choosePhotoFromLibrary = () => {
  //   ImagePicker.launchImageLibrary(
  //     { mediaType: 'photo' },
  //     (res) => {
  //       const photo = new FormData();
  //       photo.append('images', {
  //         uri: res.uri,
  //         type: res.type,
  //         name: res.fileName,
  //       });
  //       dispatch(PatchPhoto({
  //         id: Auth.data.token.id,
  //         token: Auth.data.token.token,
  //         photo: photo
  //       }));
  //     },
  //   );
  // };

  // const renderContent = () => (
  //   <View style={style.panel}>
  //     <View style={{alignItems: 'center'}}>
  //       <Text style={style.panelTitle}>Upload Photo</Text>
  //       <Text style={style.panelSubtitle}>Choose Your Profile Picture</Text>
  //     </View>
  //     <View style={{marginBottom: 40}}>
  //       <TouchableOpacity
  //         style={style.panelButton}
  //         onPress={takePhotoFromCamera}>
  //         <Text style={style.panelButtonTitle}>Take Photo From Camera</Text>
  //       </TouchableOpacity>
  //       <TouchableOpacity
  //         style={style.panelButton}
  //         onPress={choosePhotoFromLibrary}>
  //         <Text style={style.panelButtonTitle}>Take Photo From Library</Text>
  //       </TouchableOpacity>
  //       <TouchableOpacity
  //         style={style.panelButton}
  //         onPress={() => sheetRef.current.snapTo(1)}>
  //         <Text style={style.panelButtonTitle}>Cancel</Text>
  //       </TouchableOpacity>
  //     </View>
  //   </View>
  // );

  return (
        <>
          <ScrollView style={{backgroundColor: '#e9eef7'}}>
            <TouchableOpacity
              onPress={()=> navigation.navigate('Home')}>
              <Image 
                source={require('../../assets/img/arrow-left.png')} 
                style={style.arrowLeft}/>
            </TouchableOpacity>
            <View>
              <TouchableOpacity
                onPress={() => uploadImage()}>
              {data.photo? (
                <Image 
                source={{uri: `https://db-zwallet.herokuapp.com/images/${data.photo}`}}
                
                style={style.imgProfile}/>
              ) : (
                <Image 
                source={require('../../assets/images/blank.png')}
                style={style.imgProfile}/>
              )}
              </TouchableOpacity>
            </View>
            <View style={style.edit}> 
              <Image 
              source={require('../../assets/img/pen.png')} 
              style={style.subEdit}
              />
              <Text style={style.textEdit}>Edit</Text>
            </View>
            <Text style={style.name}>{data.name}</Text>
            <Text style={style.phone}>+62 {data.phone}</Text>
            <View>
              <View style={{backgroundColor: '#ccc', margin: 10, borderRadius: 15}}>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('PersonalInfo')}
                  style={style.title}>
                  <Text
                    style={style.title1}>
                    Personal Information
                  </Text>
                  <View style={style.arrowRight}>
                  <Image 
                  source={require('../../assets/img/arrowRight.png')} />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{backgroundColor: '#ccc', margin: 10, borderRadius: 15}}>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('ChangePassword')}
                  style={style.title}>
                  <Text
                    style={style.title1}>
                    Change Password
                  </Text>
                  <View style={style.arrowRight}>
                  <Image 
                  source={require('../../assets/img/arrowRight.png')} />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{backgroundColor: '#ccc', margin: 10, borderRadius: 15}}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('ChangePin')} 
                style={style.title}>
                <Text
                  style={style.title1}>
                  Change Pin
                </Text>
                <View style={style.arrowRight}>
                <Image 
                source={require('../../assets/img/arrowRight.png')} />
                </View>
                </TouchableOpacity>
              </View>
              <View style={{backgroundColor: '#ccc', margin: 10, borderRadius: 15}}>
                <View style={style.title}>
                <TouchableOpacity
                onPress={() => navigation.navigate('Notification')}>
                  <Text
                    style={style.title1}>
                    Notification
                  </Text>
                </TouchableOpacity>
                <Switch
                  value={isSwitchOn}
                  onValueChange={onToggleSwitch}
                  style={{marginLeft: 'auto', right: 15}}
                />
                </View>
              </View>
              <View style={{backgroundColor: '#ccc', margin: 10, borderRadius: 10}}>
                <TouchableOpacity onPress={() => dispatch(AuthLogout())}>
                  <View style={style.logout}>
                    <Text
                      style={style.logout1}>
                      Logout
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            {/* <BottomSheet
              ref={sheetRef}
              snapPoints={[360, 0]}
              initialSnap={1}
              callbackNode={down}
              enabledGestureInteraction
              enabledContentGestureInteraction={false}
              enabledContentTapInteraction
              renderHeader={renderHeader}
              renderContent={renderContent}
            /> */}
          </ScrollView>
        </>
  
  );
};

export default Profile;

const style = StyleSheet.create({
  arrowLeft: {
    width: 30, 
    height: 30, 
    marginVertical: 40,
    marginLeft: 20
  },
  profile: {
    alignItems: 'center'
  },
  edit: {
    alignItems: 'center',
    marginTop: 10
  },
  subEdit: {
    width: 16, 
    height: 16,
    marginTop: 10,
    marginRight: 50
  },
  textEdit: {
    marginTop: -20,
    fontSize: 17,
    color: '#666'
  },
  name: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 20
  },
  phone: {
    textAlign: 'center',
    fontWeight: 'normal',
    color: '#666',
    fontSize: 16,
    marginTop: 10
  },
  button: {
    width: '95%',
    height: 50,
    backgroundColor: '#ccc',
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20
  },
  info: {
    color: '#000',
    justifyContent: 'center',
    alignItems: 'center'
    
  },
  right: {
    marginHorizontal: -20
  },
  imgProfile: {
    width: 55, height: 55, 
    marginTop: 0,
    marginLeft: 140
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: {width: -1, height: -3},
    shadowRadius: 2,
    shadowOpacity: 0.4,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panel: {
    padding: 20,
    backgroundColor: '#FAFCFF',
    paddingTop: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    marginVertical: 7,
    elevation: 1,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'black',
  },
  title: {
    flexDirection: 'row', 
    flex: 9, 
    height: 58,
   
    
  },
  title1: {
    paddingLeft: 20,
    paddingTop: 15,
    fontSize: 18,
    color: '#4D4B57',
    fontWeight: 'bold',
   
  },
  arrowRight: {
    flex: 1,
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "flex-end",
    right: 30
  },
  logout: {
    height: 45,
    alignItems: 'center',
    
  },
  logout1: {
    alignItems: 'center', 
    fontWeight: 'bold', 
    fontSize: 18, 
    color: '#4D4B57'}
  
  });