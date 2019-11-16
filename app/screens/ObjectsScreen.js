import React from 'react';
import { ScrollView, StyleSheet, View, Text, SafeAreaView, FlatList, Image, TouchableOpacity } from 'react-native';
import { throwStatement } from '@babel/types';

import { getToken, getSavedImagesAndPrices, deleteImage } from '../authentication/Authentication.js';

export default class ObjectsScreen extends React.Component {
  state = {
      objects: [],
      selectedObject: -1
  }

  async componentDidMount() {
    this.token = await getToken("frederik", "pw123456");
    this.props.navigation.addListener('willFocus', (route) => { 
        this.updateList();
    });
    this.updateList();
  }

  updateList = async () => {
    let objects = await getSavedImagesAndPrices(this.token);
    this.setState({
        objects: objects
    });
  }

  selectObject = (index, id) => {
      if(index == this.state.selectedObject) {
          index = -1;
          id = null;
      };
      this.setState({
          selectedObject: index,
          selectedObjectId: id
      });
  }

  deleteSelectedObject = async () => {
    await deleteImage(this.token, this.state.selectedObjectId);
    await this.updateList();
    this.setState({
        selectedObject: -1,
        selectedObjectId: null
    });
  }

  renderItem = ({item, index}) => {
    return (<TouchableOpacity style={{ flex: 1, height: 200 }} onPress={() => { this.selectObject(index, item.id); }}>
                <View style={{backgroundColor: this.state.selectedObject == index ? 'red' : null, flex: 1}}>
                    <Image style={{ margin: 2, flex: 1 }} source={{uri: item.image_url}} />
                </View>
                <Text style={styles.listText}>{`${item.label} [${item.price}$]`} </Text>
            </TouchableOpacity>);
  }

  render() {
    let deleteButton = null;
    if(this.state.selectedObject >= 0) {
        deleteButton = <View style={{justifyContent: 'flex-end'}}>
                <TouchableOpacity style={styles.button} onPress={this.deleteSelectedObject}>
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
            </View>;
    }

    return (
        <View style={{flex: 1, paddingTop: 15}}>
            <FlatList numColumns={2} data={this.state.objects} extraData={this.state}
                renderItem={this.renderItem} keyExtractor={item => item.id} 
                contentContainerStyle={styles.list}/>
            {deleteButton}
        </View>
    );
  }
}

ObjectsScreen.navigationOptions = {
  title: 'Added objects',
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1
  },
  layout: {
    margin: 5,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  list: {
    justifyContent: 'center',
  },  
  listObject: {
    flex: 1,
    alignSelf: 'stretch'
  },
  listText: {
    textAlign: 'center',
    fontSize: 15
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'red',
    padding: 10
  },
  buttonText: {
    fontSize: 20
  },  
});
