import React from 'react'
import Swiper from 'react-native-swiper'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera, Permissions, Video } from 'expo';
import { Ionicons } from '@expo/vector-icons';

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
    videoList: [
      {
        id:1,
        url: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4"
      },
      {
        id:2,
        url: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4"
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
      <Swiper
        loop={false}
        showsPagination={true}
        index={0}>
        {this.state.videoList.map(video => (
          <View key={video.id} style={{
            flex:1,
            justifyContent: 'center',
            alignItems: 'center',}}
          >
            <Video
              source={{ uri: video.url }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode="cover"
              shouldPlay
              isLooping
              style={{ width: '100%', height: '100%' }}
            />
          </View>
        ))}
      </Swiper>
    )
  }
}

class StamperCamera extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    isRecording: false
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }
  stopRecording = () => {
    this.camera.stopRecording();
    this.setState({ isRecording: false });
  }
  recordVideo = () => {
    if (this.camera) {
      this.camera.recordAsync({
        quality: Camera.Constants.VideoQuality['720p'],
        maxDuration: 8
      });
      this.setState({ isRecording : true });
    }
  };

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1, width: '100%', height: '100%' }}>
          <Camera
            style={{ flex: 1, height: '100%' }}
            type={this.state.type}
            ref={ref => {
              this.camera = ref;
            }}
          >
            <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              width: '100%',
              height: '100%'
            }}>
              <View style={{
                paddingBottom: 30,
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}>
                <TouchableOpacity
                  style={{
                    flex: 1
                  }}
                  onPress={() => {
                    this.setState({
                      type: this.state.type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back,
                    });
                  }}>
                  <Ionicons name="ios-flash-outline" size={32} color="white" />
                </TouchableOpacity>
                {this.state.isRecording ? 
                  <View style={{
                    width: 35, height: 35, borderRadius: 50, flex: 1,
                    borderColor: '#ff4869', borderWidth: 10}}
                    onPress={this.stopRecording}></View>
                  :
                  <View style={{
                    width: 35, height: 35, borderRadius: 50,
                    borderColor: 'white', borderWidth: 10}}
                    onPress={this.recordVideo}></View>
                } 
                <TouchableOpacity
                  style={{
                    flex: 1,
                  }}
                  onPress={() => {
                    this.setState({
                      type: this.state.type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back,
                    });
                  }}>
                  <View style={{flex:1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                    <Ionicons name="md-sync" size={32} color="white" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </Camera>
        </View>
      );
    }
  }
}
class App extends React.Component {
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
      flex: 1,
      width: '100%',
      height: '100%'
    }
  }

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
          height: '100%'
        }}>
          <StamperVideo />
        </View>
        <View style={this.cameraStyle()}>
          <StamperCamera />
        </View>
      </Swiper> 
    )
  }
}

export default App