import React from 'react';
import { FlatList, Image as ImageNative, ScrollView, StyleSheet, View, TouchableOpacity, Text, Slider } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { addImage, getSavedImagesAndPrices, getToken, submitImage } from "../authentication/Authentication.js";
import * as ImageManipulator from 'expo-image-manipulator';
import Svg, {Image, Rect, Text as SvgText} from 'react-native-svg';
import layout from "../constants/Layout.js";

export default class GuessScreen extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    objects: [],
    correctGuess: null
  };
  guessResponse = null;

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
    this.token = await getToken("frederik", "pw123456");
    this.updateList();
    this.props.navigation.addListener('willFocus', (route) => { 
      this.updateList();
    });
  }

  updateList = async () => {
    let objects = await getSavedImagesAndPrices(this.token);
    this.setState({
        objects: objects
    });
  }

  takePhoto = async() => {
    if (this.camera) {
      this.last_photo = await this.camera.takePictureAsync();
      if(!this.last_photo) {
        throw Error("Can't take photo");
        return;
      }
      let image = await ImageManipulator.manipulateAsync(this.last_photo.uri, [{resize: {width: 640}}], {base64: true});
      await this.setState({image: image.uri, price: 0.1, imageRects: [], selectedObject: -1});
      this.forceUpdate();

      let imageData = image.base64;
      let initialImageRects = await submitImage(this.token, imageData, layout.window.width, 400);
      
      initialImageRects.sort((a, b) => {
        let area1 = (a.x2 - a.x1) * (a.y2 - a.y1);
        let area2 = (b.x2 - b.x1) * (b.y2 - b.y1);
        if(area1 == area2) return 0;
        return area1 < area2 ? 1 : -1;
      });

      let imageRects = [];
      let price = 0;
      for(let i = 0; i < initialImageRects.length; ++i) {
        for(let j = 0; j < this.state.objects.length; ++j) {
          if(this.state.objects[j].label == initialImageRects[i].object) {
            price = this.state.objects[j].price;
            break;
          }
        }
        if(price > 0) {
          imageRects.push(initialImageRects[i]);
          break;
        }
      }

      if(price <= 0) {
        this.guessResponse = <Text>Invalid photo, try to take another one</Text>;
      } else {
        await this.setState({imageRects, selectedObject: -1, correctPrice: price});
      }
    }
  }

  takeNewPhoto = () => {
    this.guessResponse = null;
    this.setState({image: null, price: 0.1, correctGuess: null});
  }

  wrongGuess = () => {
    this.guessResponse = <Text style={{textAlign: 'center', fontSize: 20}}>Wrong guess! Try again later :)</Text>
    this.setState({correctGuess: false})
  }

  addGuess = async () => {
    if(this.state.correctPrice * 0.9 - 1 > this.state.price) {
      return this.wrongGuess();
    }
    if(this.state.correctPrice * 1.1 + 1 < this.state.price) {
      return this.wrongGuess();
    }
    // correct guess
    this.guessResponse = <Text style={{textAlign: 'center', fontSize: 20}}>Correct guess! Good job!</Text>
    this.setState({correctGuess: true})
  }

  sliderValueChange = (val) => {
    val = Math.floor(Math.pow((val / 2),2) * 10) / 10;
    this.setState({price: val});
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
          <Camera style={{ flex: 1, height: 400 }} type={this.state.type} ref={ref => { this.camera = ref; }} />
          <TouchableOpacity style={styles.button} onPress={this.takePhoto}>
            <Text style={styles.buttonText}>Take photo</Text>
          </TouchableOpacity>
        </ScrollView>
      );
    }

    let rects = [];
    for(let i = 0; i < this.state.imageRects.length; ++i) {
      let rect = this.state.imageRects[i];
      if(this.state.correctGuess === null) {
        rects.push(<Rect key={"Rect" + i} x={(rect.x1)} y={(rect.y1)}
          width={(rect.x2-rect.x1)} height={(rect.y2-rect.y1)} fill="none" strokeWidth="3" 
          stroke="green" />);
      } else if(this.state.correctGuess === true) {
        rects.push(<Rect key={"Rect" + i} x={(rect.x1)} y={(rect.y1)}
          width={(rect.x2-rect.x1)} height={(rect.y2-rect.y1)} fill="none" strokeWidth="7" 
          stroke="green" />);
          rects.push(<SvgText key="text" x="50%" y="50%" fontSize="40" textAnchor="middle" fontWeight="bold" fill="green"
          stroke="green">CORRECT!</SvgText>)
      } else {
        rects.push(<Rect key={"Rect" + i} x={(rect.x1)} y={(rect.y1)}
          width={(rect.x2-rect.x1)} height={(rect.y2-rect.y1)} fill="none" strokeWidth="7" 
          stroke="red" />);
        rects.push(<SvgText key="text" x="50%" y="50%" fontSize="40" textAnchor="middle" fontWeight="bold" fill="red"
          stroke="red">Wrong!</SvgText>)
      }
    }

    let objectSelection = <View style={styles.optionView}><Text style={styles.infoText}>Searching for the objects</Text></View>;
    if(this.state.correctPrice > 0 && !this.guessResponse) {
      objectSelection = <View>
          <View style={styles.optionView}>
            <Text style={styles.infoText}>What's the price of that?</Text>
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
          <TouchableOpacity style={styles.button} onPress={this.addGuess}>
              <Text style={styles.buttonText}>Guess the price!</Text>
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
        {this.guessResponse ? this.guessResponse : objectSelection}
      </ScrollView>      
    );
  }
}

GuessScreen.navigationOptions = {
  title: 'Guess the price!',
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
