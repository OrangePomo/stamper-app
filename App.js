import React from 'react'
import Swiper from 'react-native-swiper'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera, Permissions, Video } from 'expo';

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
class App extends React.Component {
  state = { isLoggedIn: true };
  cameraStyle() {
    return {
      flex: 1
    }
  }

  render() {
    return this.state.isLoggedIn ? (
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
          <StamperVideo />
        </View>
        <View style={this.cameraStyle()}>
          <StamperCamera />
        </View>
      </Swiper> 
    ) : (
      <View style={{backgroundColor: 'white'}}>
        <View style={{backgroundColor: '#ff4869', height: '40%', width: '100%'}}>
          <View style={{alignItems: 'center', width: '100%'}}>
            <Text style={{fontSize: 30, color: 'white', paddingTop: '30%', justifyContent: 'center'}}>
              Stamper
            </Text>
          </View>
        </View>
        <View style={{alignItems: 'center', width: '60%', height: '20%', alignSelf: 'center',
          borderRadius: 50, backgroundColor: 'white', shadowColor: 'black',
          shadowOffset: {width: 0, height: 3}, shadowRadius: 5, shadowOpacity: 0.5, display: 'flex', flexDirection:'row'}}>
          <View style={{alignItems: 'center', display: 'flex', flexDirection: 'column'}}>
            <Text style={{color: 'black', alignSelf: 'center'}}> 
              Login via wechat 
            </Text>
          </View>
        </View>
      </View>
    )
  }
}

export default App