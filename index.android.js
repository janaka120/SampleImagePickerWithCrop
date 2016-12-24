/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

// import React, { Component } from 'react';
// import {
//   AppRegistry,
//   StyleSheet,
//   Text,
//   View
// } from 'react-native';

// export default class TestImageCopper extends Component {
//   render() {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.welcome}>
//           Welcome to React Native!
//         </Text>
//         <Text style={styles.instructions}>
//           To get started, edit index.android.js
//         </Text>
//         <Text style={styles.instructions}>
//           Double tap R on your keyboard to reload,{'\n'}
//           Shake or press menu button for dev menu
//         </Text>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
// });

// AppRegistry.registerComponent('TestImageCopper', () => TestImageCopper);



import React, { Component } from 'react'
import {
  Text,
  View,
  Image,
  Slider,
  ScrollView,
  AppRegistry,
  TouchableOpacity,
} from 'react-native'

import {ImageCrop} from 'react-native-image-cropper';
var Platform = require('react-native').Platform;
var ImagePicker = require('react-native-image-picker');
import Icon from 'react-native-vector-icons/FontAwesome';

class TestImageCopper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: 'http://i.imgur.com/tCatS2c.jpg',
      height: 200,
      width: 300,
      zoom: 50,
      showNew: true,
      newImage: null,
      imageAvalable: false
    };
  }

  render() {
    return (
      <ScrollView>
        <View style={{alignItems: 'center', flex: 1, marginTop: 15}}>
          <TouchableOpacity style={{marginBottom: 10}} onPress={this._onPress.bind(this)}>
            <View style={{ height: 40, width: 40}}>
              <Icon name="camera" size={30} color="#959799" />
            </View>
          </TouchableOpacity>
          { this.state.imageAvalable ?
            <View>
              <ImageCrop 
                ref={'cropper'}
                image={this.state.image}
                cropHeight={this.state.height}
                cropWidth={this.state.width}
                zoom={this.state.zoom}
                maxZoom={80}
                minZoom={20}
                panToMove={true}
                pinchToZoom={true}
              />
              <View style={{flex: 1, marginTop: 20}}>
                <Slider
                  value={this.state.zoom}
                  onValueChange={value => this.setState({zoom: value})}
                  maximumValue={100}
                  minimumValue={0}
                  step={0.1}
                />
                <TouchableOpacity onPress={this.capture.bind(this)}>
                  <View style={{flex: 1, alignItems: "center", justifyContent: "center",marginTop: 20}}>
                    <Text style={{color: "grey", padding: 10}}>CAPTURE</Text>
                  </View>
                </TouchableOpacity>

                { this.state.newImage ? 
                  <Image source={{ uri: this.state.newImage }} style={{height: this.state.height, width: this.state.width}} />
                  : null
                }

              </View>
            </View>
            : null 
          }
        </View> 
      </ScrollView>
    );
  }

  capture(){
    this.refs.cropper.crop()
    .then(res =>{
      this.setState({
        showNew: true,
        newImage: res,
      });
    })
  }

  _onPress() {
    var options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        // You can display the image using either data...
        const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
        
        this.setState({
          imageAvalable: true,
          image: source.uri
        });
        
        // or a reference to the platform specific asset location
        if (Platform.OS === 'ios') {
          const source = {uri: response.uri.replace('file://', ''), isStatic: true};
        } else {
          const source = {uri: response.uri, isStatic: true};
        }

        this.setState({
          avatarSource: source
        });
      }
    });
  }
}

AppRegistry.registerComponent('TestImageCopper', () => TestImageCopper)

