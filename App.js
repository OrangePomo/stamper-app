import React from 'react'
import Swiper from 'react-native-swiper'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { Location, Camera, Permissions, Video, MapView } from 'expo';
import { Header, Icon } from 'react-native-elements';
const Marker = MapView.Marker

const deltas = {
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421
};

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

class TitleText extends React.Component {
  render() {
    return (
      <Text style={{ fontSize: 48, color: 'black' }}>
        {this.props.label}
      </Text>
    )
  }
}

class StamperVideo extends React.Component {
  state = {
    isHeartFull: false, 
    videoList: [
      {
        id:1,
        // url: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4"
        // url: "http://52.79.250.237:3000/video/straming/4d18189705fd833075fbafe545e0f956.MOV"
        url: "http://52.79.250.237:3000/vd/4d18189705fd833075fbafe545e0f956.MOV"
      },
      {
        id:2,
        // url: "http://52.79.250.237:3000/video/straming/0b06a33850ae5286104eb2870355b88b.mov"
        url: "http://52.79.250.237:3000/vd/0b06a33850ae5286104eb2870355b88b.mov"
      },
      {
        id:3,
        url: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4"
      }
    ],
    videoIndex: 0
  }
  render() {
    return (
      <View style={{flex:1}}
      >
      <View style={{position: "relative", top: "6%", display: "flex", flexDirection: 'row', justifyContent: "space-between", zIndex: 1500}}>
        <Icon
          name='map-o'
          type='font-awesome'
          style={{display: "flex", marginLeft: "3%"}}
          color='white'/>
        <Icon
          name='more-vert'
          type='MaterialIcons'
          style={{display: "flex"}}
          color='white'/>
    </View>
        <Swiper
          loop={false}
          showsPagination={true}
          index={0}>
          {this.state.videoList.map(video => (
            <View key={video.id} style={{
              position: "relative",
              flex:1,
              justifyContent: 'flex-end',
              alignItems: 'center',}}
            >
              <Video
                source={{ uri: video.url }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                // resizeMode="cover"
                resizeMode={Expo.Video.RESIZE_MODE_COVER}
                shouldPlay
                isLooping
                style={{ width: '100%', height: '100%' }}
              />
            </View>
          ))}
        </Swiper>
        <View style={{position: "absolute", display: "flex", width: "100%", bottom: "6%", flexDirection: 'row', justifyContent: "space-between", alignContent: "center", zIndex: 1500, padding: 30}}>
          <Icon
            name={this.state.isHeartFull? "heart" : "heart-o"}
            type='font-awesome'
            style={{position: "absolute", left: "5rem"}}
            color={this.state.isHeartFull? "#EC586C" : "white"}
            onPress={()=>this.setState({isHeartFull: !this.state.isHeartFull})}
            />
          <View>
            <Icon
              name='video-camera'
              type='font-awesome'
              style={{display: "flex"}}
              color='white'/>
            <Icon
              name='chevron-small-down'
              type='entypo'
              style={{display: "flex"}}
              color='white'/>
          </View>
          <Text style={{color: "white"}}>900m</Text>
        </View>
        
      </View>
    )
  }
}

class StamperCamera extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    isRecording: false,
    videoURI: null
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }
  stopRecording = () => {
    this.camera.stopRecording();
    this.setState({ isRecording: false });

  }
  uploadVideo(){
    let formData = new FormData();
    let videoURI = this.state.videoURI
    let payload = {'value':videoURI,'uid':'abcde','latitude':102.12,'longitude':33.21};
    // let payload = {videoFile:{'value':videoURI},'uid':'abcde','latitude':102.12,'longitude':33.21}
    formData.append('data',payload)
    // formData.append('videoFile',{'value':videoURI,'uid':'abcde','latitude':'102.12','longitude':'33.21'});
    // formData.append('value1', formData.get('videoFile'))
    // formData.append('uid', 'abcde');
    // formData.append('latitude', '102.12');
    // formData.append('longitude', '33.21');

    console.log(formData)

    try{
      fetch('http://52.79.250.237:3000/video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: formData,
      success: function(data){
        console.log(data.result)
      }
    });
    } catch (e) {
      console.log(e) 
    }
  }
   recordVideo = async () => {
    if (this.camera) {
      this.setState({ isRecording : true });
      const videoURI = await this.camera.recordAsync({
        quality: Camera.Constants.VideoQuality['720p'],
        maxDuration: 8
      });
      console.log("qqqq", videoURI)
      this.setState({ videoURI });
      this.uploadVideo()
      // axios 사용해서 서버에 동영상 업로드
    //  fetch(this.videoURI, {
    //     method: 'POST',
    //     headers: {
    //       Accept: 'application/json',
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       firstParam: 'yourValue',
    //       secondParam: 'yourOtherValue',
    //     }), 
    // });

    

    //get method로 확인

  }
}
  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera
            style={{ flex: 1 }}
            type={this.state.type}
            ref={ref => {
              this.camera = ref;
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}>
              {this.state.isRecording ? 
                <TouchableOpacity
                  style={{
                    flex: 1,
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                  }}
                  onPress={this.stopRecording}>
                  <Text
                    style={{ fontSize: 18, marginBottom: 10, color: 'black' }}>
                    {' '}중지{' '}
                  </Text>
                </TouchableOpacity>
                :
                <TouchableOpacity
                  style={{
                    flex: 1,
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                  }}
                  onPress={this.recordVideo}>
                  <Text
                    style={{ fontSize: 18, marginBottom: 10, color: 'black' }}>
                    {' '}녹화{' '}
                  </Text>
                </TouchableOpacity>
              }

              <TouchableOpacity
                style={{
                  flex: 1,
                  alignSelf: 'flex-start',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.setState({
                    type: this.state.type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back,
                  });
                }}>
                <Text
                  style={{ fontSize: 18, marginBottom: 10, color: 'black' }}>
                  {' '}Flip{' '}
                </Text>
              </TouchableOpacity>
              }
            </View>
          </Camera>
        </View>
      );
    }
  }
}

class StamperMap extends React.Component {
  componentWillMount() {
    this.props.getLocationAsync();
  }
  shouldComponentUpdate(props) {
    console.log(">> ", props);
    return true;
  }

  render() {
    return (
      <View style={{flex:1}}>
        
        <MapView
          ref={(mapview) => {this.mapview = mapview;}}
          style={{ width: "100%", height: "100%", display: "flex", alignItems: "flex-end", justifyContent: "flex-end" }}
          region={this.props.region}
          showsUserLocation
          showsMyLocationButton
          userLocationAnnotationTitle={"하이"}

        >
          <Marker
            coordinate={{
              latitude: 32.382482,
              longitude: 120.604785
            }}
            title={"OrangePomo"}
            description={"힝행홍"}
            image="https://i.imgur.com/g7BkLn0.png"
          />
          <Marker
            coordinate={{
              latitude: 32.388477,
              longitude: 120.572145
            }}
            image="https://i.imgur.com/Dn1qd0F.png"
            title={"랄랄"}
            description={"꺄꺄"}
          />
          <Icon
            raised
            name='gps-fixed'
            type='MaterialIcons'
            color='#EC586C'
            style={{margin: "10px"}}
            onPress={()=>this.mapview.animateToRegion(this.props.region,500)}
          />
        </MapView>
      </View>
    )
  }
}

class App extends React.Component {

  state = {
    region: null,
    myStamps: [],
    test: "123",
    newIndex: 0,
  };

  // this.handleSwipe = this.handleSwipe.bind(this)

  getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied'
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    const region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      ...deltas
    };
    await this.setState({ region });
  }

  viewStyle() {
    return {
      flex: 1,
      backgroundColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
    }
  }
  cameraStyle() {
    return {
      flex: 1
    }
  }
  // handleSwipe() {
  //   this.swiper.scrollBy(1, true)
  // }

  render() {
    return (
      <Swiper
        horizontal={false}
        loop={false}
        showsPagination={false}
        index={0}>
        <View style={{
          flex: 1,
          backgroundColor: 'transparent',
          flexDirection: 'row',
        }}>
          <Swiper
            loop={false}
            showsPagination={false}
            yourNewPageIndex={this.state.newIndex}
            ref={(swiper) => {this.swiper = swiper;}}
            index={1}>
            <View key={0} style={{
              flex:1
            }}>
              <View>
              <Header
                backgroundColor="white"
                leftComponent={{ icon: 'settings', color: '#EC586C' }}
                centerComponent={{ text: 'My map', style: { color: '#EC586C', fontWeight: "bold" } }}
                rightComponent={
                  <Icon
                    name='chevron-right'
                    type='font-awesome'
                    color='#EC586C'
                    style={{fontWeight: "300"}}
                    onPress={()=>this.swiper.scrollBy(1, true)} />
                }
              />
              </View>
              <StamperMap getLocationAsync={this.getLocationAsync} region={this.state.region} />
            </View>
            <StamperVideo />
          </Swiper>
        </View>
        <View style={this.cameraStyle()}>
          <StamperCamera />
        </View>
      </Swiper> 
    )
  }
}

export default App