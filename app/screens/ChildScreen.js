import React from 'react';
import { ScrollView, StyleSheet, View, Text, Image, SafeAreaView, TouchableOpacity, Slider, FlatList } from 'react-native';
import { LineChart, Grid, PieChart, YAxis, XAxis, AreaChart } from 'react-native-svg-charts'
import * as shape from 'd3-shape'
import { getToken, getSavedImagesAndPrices, deleteImage, getChildren, getFirstChild, getBalance, addBalanceTransaction } from '../authentication/Authentication.js';

class ExtraCredits extends React.Component {
    state = {
        extraCredits: 0,
        added: 0,
        balance: 0
    }

    async componentDidMount() {
        this.token = await getToken("frederik", "pw123456");
        this.childId = await getFirstChild(this.token);
        this.setState({
            balance: await getBalance(this.token, this.childId)
        });
    }

    sliderValueChange = (value) => {
        this.setState({extraCredits: value});
    }

    addCredits = async () => {
        await addBalanceTransaction(this.token, this.childId, this.state.extraCredits);
        this.setState({
            added: this.state.extraCredits,
            balance: this.state.balance + this.state.extraCredits
        });
        setTimeout(() => {
            this.setState({
                added: 0
            });    
        }, 1000)
    }
    
    render() {
        if(this.state.added != 0) {
            return (
                <View style={{alignItems: 'center'}}>
                    <Text style={{fontSize: 20, paddingTop: 10}}>Extra credits: {this.state.extraCredits}$</Text>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Added {this.state.added} extra credits!</Text>
                    </TouchableOpacity>
                </View>
            );    
        }
        return (
            <View style={{alignItems: 'center'}}>
                <Text style={{fontSize: 20, paddingTop: 10}}>Extra credits: {this.state.extraCredits}$</Text>
                <Slider
                    style={{width: 300, height: 40}}
                    minimumValue={-100}
                    maximumValue={100}
                    step={1}
                    minimumTrackTintColor="#111111"
                    maximumTrackTintColor="#000000"
                    onValueChange={this.sliderValueChange}
                />
                <TouchableOpacity style={styles.button} onPress={this.addCredits}>
                    <Text style={styles.buttonText}>Add him some credits!</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default class ChildScreen extends React.Component {
  data = [];
  elements = [];
  state = {
      balance: 100
  }

  async componentDidMount() {
    this.token = await getToken("frederik", "pw123456");
    this.childId = await getFirstChild(this.token);
    this.state.balance = await getBalance(this.token, this.childId);

    for(let i = 0; i < 100; i += 5) {
        this.data.push(i + Math.random() * 20);
    }
    this.data.push(this.state.balance);

    this.elements.push(<View style={{alignItems: 'center'}}>
        <Image style={{width: 200, height: 200}} source={require('../assets/images/kid.png')} />
    </View>);
    this.elements.push(<Text style={{textAlign: 'center', marginTop: 10, fontSize: 20}}>Current balance: {this.state.balance}$</Text>);
    this.elements.push(this.chart());
    this.elements.push(<ExtraCredits />);
    this.elements.push(<Text style={{textAlign: 'center', marginTop: 10, fontSize: 20}}>Good job! You're a good parent!</Text>);
    this.forceUpdate();
  }

  chart = () => {
    const contentInset = { top: 20, bottom: 20}
    return (<View>
      <Text style={{textAlign: 'center'}}>Credit</Text>
      <SafeAreaView style={{flex: 1}}>
        <View style={{height: 200, flexDirection: 'row', marginLeft: 5}}>
            <YAxis
                data={ this.data }
                formatLabel={ value => `${value}` }
                contentInset={{top: 20, bottom: 20}}
                svg={{
                    fill: 'grey',
                    fontSize: 10,
                }}
                numberOfTicks={ 8 }
            />
            <LineChart
                style={{ flex: 1, marginLeft: 10, marginRight: 10}}
                data={ this.data }
                svg={{ stroke: 'rgb(134, 65, 244)' }}
                contentInset={{top: 10, bottom: 10}}
                yMin={0} yMax={150}>
                <Grid/>
            </LineChart>
        </View>
        <XAxis
            data={ this.data }
            formatLabel={ (value, index) => index }
            contentInset={{ left: 30, right: 10 }}
            numberOfTicks={ 10 }
            svg={{ fontSize: 10, fill: 'black' }}
        />
    </SafeAreaView>  
    </View>)
  }

  renderElement = ({item}) => {
      return item;
  }

  render() {
    return (
        <FlatList data={this.elements}
            renderItem={this.renderElement} keyExtractor={(item, index) => `item_${index}`} />
    );
  }
}

ChildScreen.navigationOptions = {
  title: 'Lukas',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10
  },
  buttonText: {
    fontSize: 20
  },
});
