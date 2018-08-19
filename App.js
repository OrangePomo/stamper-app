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
              style={{ width: '100%', height: '80%' }}
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
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
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
          <Camera style={{ flex: 1 }} type={this.state.type}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: 'flex-end',
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
            name='gear'
            type='font-awesome'
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
            index={0}>
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