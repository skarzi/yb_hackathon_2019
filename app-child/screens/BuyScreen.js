import React from 'react';
import { FlatList, Image as ImageNative, ScrollView, StyleSheet, View, TouchableOpacity, Text, Slider } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { doTransaction, getFirstChild, getBalance, getObject, getToken, submitImage } from "../authentication/Authentication.js";
import * as ImageManipulator from 'expo-image-manipulator';
import Svg, {Image, Rect} from 'react-native-svg';
import layout from "../constants/Layout.js";

export default class BuyScreen extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
    this.token = await getToken("frederik", "pw123456");
    this.childId = await getFirstChild(this.token);
    this.updateBalance();
  }

  updateBalance = async () => {
    let balance = await getBalance(this.token, this.childId);
    this.setState({ balance })
  }

  takePhoto = async() => {
    if (this.camera) {
      console.log("take");
      this.last_photo = await this.camera.takePictureAsync();

      let image = await ImageManipulator.manipulateAsync(this.last_photo.uri, [{resize: {width: 640}}], {base64: true});

      let imageData = image.base64;
      let imageRects = await submitImage(this.token, imageData, layout.window.width, 400);
      
      await this.setState({image: image.uri, price: 0.1, imageRects: [], selectedObject: -1});
      await this.setState({imageRects, selectedObject: -1});
    }
  }

  takeNewPhoto = () => {
    this.setState({image: null, price: 0.1});
  }


  selectObject = async (index, name) => {
    if(this.state.selectedObject == index) {
      this.setState({
        selectedObject: -1,
        price: 0.1,
        selectedObjectPrice: 0.0,
      });
      return;
    }

    const selectedObjectInfo = await getObject(this.token, name);
    this.setState({
      selectedObject: index,
      selectedObjectName: name,
      selectedObjectPrice: selectedObjectInfo.price,
      selectedObjectId: selectedObjectInfo.id
    });
  }

  buyObject = async () => {
    console.log("BUY OBJECT", this.state.selectedObjectId);
    let transaction = await doTransaction(this.token, this.childId, this.state.selectedObjectId);
    this.updateBalance();
    this.takeNewPhoto();

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
          <Text style={ styles.header }>
            Balance: {this.state.balance}
          </Text>
        </ScrollView>
      );
    }

    let rects = [];
    for(let i = 0; i < this.state.imageRects.length; ++i) {
      let rect = this.state.imageRects[i];
      rects.push(<Rect key={"Rect" + i} x={(rect.x1)} y={(rect.y1)}
        width={(rect.x2-rect.x1)} height={(rect.y2-rect.y1)} fill="none" strokeWidth="3" 
        stroke={this.state.selectedObject == i ? "green" : "red"} onPress={() => { this.selectObject(i, rect.object); }} />);
    }

    let objectSelection = <View style={styles.optionView}><Text style={styles.infoText}>Select an object</Text></View>;
    let moneyText = this.state.selectedObjectName + " is not for sale";
    if (this.state.selectedObjectPrice > 0.0) {
      moneyText = this.state.selectedObjectName + " costs " + this.state.selectedObjectPrice;
    }

    let balanceAfterBuy = this.state.balance - this.state.selectedObjectPrice;
    let buyStyle = (this.state.selectedObjectPrice > 0.0 && balanceAfterBuy >= 0) ? styles.buttonBuy : styles.buttonNoBuy;
    let buyText = (this.state.selectedObjectPrice > 0.0 && balanceAfterBuy >= 0) ? "Buy" : "Can't Buy";
    let buyFunc = (this.state.selectedObjectPrice > 0.0 && balanceAfterBuy >= 0) ? () => { this.buyObject(); } : () => {};

    if (this.state.selectedObject >= 0) {
      objectSelection = <View>
          <View style={styles.optionView}>
            <Text style={styles.infoText}>{moneyText}</Text>
            { (this.state.selectedObjectPrice > 0.0 && balanceAfterBuy >= 0) && <Text style={styles.infoText}>Balance after buy: {balanceAfterBuy}</Text> }
          </View>
          <TouchableOpacity style={styles.button} onPress={buyFunc}>
              <Text style={buyStyle}>{buyText}</Text>
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
      </ScrollView>      
    );
  }
}

BuyScreen.navigationOptions = {
  title: 'Buy an object',
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
  buttonBuy: {
    alignItems: 'center',
    backgroundColor: '#00FF00',
    padding: 10
  },
  buttonNoBuy: {
    alignItems: 'center',
    backgroundColor: '#FF0000',
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
