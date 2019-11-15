import React from 'react';
import { FlatList, Image as ImageNative, ScrollView, StyleSheet, View, TouchableOpacity, Text, Slider } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { getSavedImagesAndPrices } from "../authentication/Authentication.js";
import * as ImageManipulator from 'expo-image-manipulator';
import Svg, {Image, Rect} from 'react-native-svg';

export default class AddScreen extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
    await this.updateImagesAndPrices();
  }

  updateImagesAndPrices = async() => {
    const imagesAndPrices = [ // await getSavedImagesAndPrices();
      { key: 0, image: 'http://thumbs.dreamstime.com/z/close-up-angry-chihuahua-growling-2-years-old-15126199.jpg', price: 10, name: 'Dog' },
      { key: 1, image: 'http://thumbs.dreamstime.com/z/close-up-angry-chihuahua-growling-2-years-old-15126199.jpg', price: 20, name: 'Dog' },
    ];
    this.setState({ imagesAndPrices });
  }

  renderImageAndPrice = ({ item, index }) => {
    return (
      <View style={styles.containerImage}>
        <ImageNative style={{width: "50%", height: 120}} source={{uri: item.image}}/>
        <Text>
          {item.name}: {item.price}$
        </Text>
      </View>
    )
  }

  takePhoto = async() => {
    if (this.camera) {
      console.log("take");
      let photo = await this.camera.takePictureAsync();
      let image = await ImageManipulator.manipulateAsync(photo.uri, [{resize: {width: 640}}], {base64: true});
      let imageData = image.base64;
      // send imageData to api
      await this.setState({image: image.uri, price: 0.1, imageRects: [], selectedObject: -1});
      await this.setState({imageRects: [
        {
          x1: 2,
          y1: 3,
          x2: 10,
          y2: 15,
          object: "Nothing special"
        }, 
        {
          x1: 21,
          y1: 32,
          x2: 50,
          y2: 45,
          object: "Bottle of whisky"
        },
        {
          x1: 61,
          y1: 57,
          x2: 90,
          y2: 99,
          object: "Banana"
        } 
      ], selectedObject: -1});
    }
  }

  takeNewPhoto = () => {
    this.setState({image: null, price: 0.1});
  }

  sliderValueChange = (val) => {
    val = Math.floor(Math.pow((val / 2),2) * 10) / 10;
    this.setState({price: val});
  }

  selectObject = (index, name) => {
    if(this.state.selectedObject == index) {
      this.setState({
        selectedObject: -1,
        price: 0.1
      });
      return;
    }
    this.setState({
      selectedObject: index,
      selectedObjectName: name
    });
  }

  render() {
    if(!this.state.hasCameraPermission) {
      return (
        <ScrollView style={styles.container}>
            <Text style={styles.infoText}>Waiting for camera permission</Text>
        </ScrollView>
      );
    }
    if(!this.state.image) {
      return (
        <ScrollView style={styles.container}>
          <Camera style={{ flex: 1, height: 400 }} type={this.state.type}
            pictureSize="640x480" ratio="4:3" ref={ref => { this.camera = ref; }} />
          <TouchableOpacity style={styles.button} onPress={this.takePhoto}>
            <Text style={styles.buttonText}>Take photo</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Objects Added</Text>
          <FlatList
            numColumns={2}
            contentContainerStyle={styles.list}
            data={this.state.imagesAndPrices}
            renderItem={this.renderImageAndPrice}
          />
        </ScrollView>
      );
    }

    let rects = [];
    for(let i = 0; i < this.state.imageRects.length; ++i) {
      let rect = this.state.imageRects[i];
      rects.push(<Rect key={"Rect" + i} x={"" + (rect.x1) + "%"} y={"" + (rect.y1) + "%"}
        width={"" + (rect.x2-rect.x1) + "%"} height={"" + (rect.y2-rect.y1) + "%"} fill="none" strokeWidth="3" 
        stroke={this.state.selectedObject == i ? "green" : "red"} onPress={() => { this.selectObject(i, rect.object); }} />);
    }

    let objectSelection = <View style={styles.optionView}><Text style={styles.infoText}>Select an object</Text></View>;
    if(this.state.selectedObject >= 0) {
      objectSelection = <View>
          <View style={styles.optionView}>
            <Text style={styles.infoText}>Selected object: {this.state.selectedObjectName}</Text>
            <Text style={{fontSize: 20, paddingTop: 10}}>Price: {this.state.price}$</Text>
            <Slider
              style={{width: 300, height: 40}}
              minimumValue={1}
              maximumValue={100}
              step={0.1}
              minimumTrackTintColor="#111111"
              maximumTrackTintColor="#000000"
              onValueChange={this.sliderValueChange}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={this.takeNewPhoto}>
              <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>;
    }

    return (
      <ScrollView style={styles.container}>
        <Svg style={{ flex: 1, height: 400 }}>
          <Image
            width="100%"
            height="100%"
            href={this.state.image}
          />
          {rects}
        </Svg>
        <TouchableOpacity style={styles.button} onPress={this.takeNewPhoto}>
            <Text style={styles.buttonText}>Take another photo</Text>
        </TouchableOpacity>
        {objectSelection}
        <Text style={styles.header}>Objects Added</Text>
        <FlatList
          numColumns={2}
          contentContainerStyle={styles.list}
          data={this.state.imagesAndPrices}
          renderItem={this.renderImageAndPrice}
        />
      </ScrollView>      
    );
  }
}

AddScreen.navigationOptions = {
  title: 'Add new object',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  optionView: {
    alignItems: 'center',
    flex: 1
  },
  infoText: {
    alignContent: 'center',
    fontSize: 20,
    paddingTop: 10
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10
  },
  buttonText: {
    fontSize: 20
  },
  list: {
    justifyContent: 'center',
  },
  containerImage: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: '#fff',
    alignSelf: 'center',
    paddingTop:10,
  },
  header: {
    paddingTop:15,
    textAlign:'center',
    fontWeight:'bold',
    fontSize:18,
  },
  imageItem: {
    margin: "1%",
    width: "48%",
    paddingTop: 20,
    paddingBottom: 20,
    borderColor: '#CCC',
    borderWidth: 1,
  },
});
