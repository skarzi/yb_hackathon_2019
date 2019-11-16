import React from 'react';
import { ScrollView, StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { LineChart, Grid, PieChart, YAxis, XAxis, AreaChart } from 'react-native-svg-charts'
import * as shape from 'd3-shape'

export default class ChildScreen extends React.Component {
  happiness = () => {
    const data = [10,20,30,40,50,40,10,30,60,70,90,99]
    return (<View>
      <Text>Some text</Text>
      <LineChart
                style={{ height: 200 }}
                data={data}
                svg={{ stroke: 'rgb(134, 65, 244)' }}
                contentInset={{ top: 20, bottom: 20 }}
            >
                <Grid />
            </LineChart>      
    </View>)
  }
  money = () => {
    const data = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80]
    const randomColor = () => ('#' + ((Math.random() * 0xffffff) << 0).toString(16) + '000000').slice(0, 7)
    const pieData = data
    .filter((value) => value > 0)
    .map((value, index) => ({
        value,
        svg: {
            fill: randomColor()
        },
        key: `pie-${index}`,
    }))
    return (<View>
      <Text>Some text</Text>
      <PieChart style={{ height: 200 }} data={pieData} />
    </View>)
  }
  addiction = () => {
    const data = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80]
    const contentInset = { top: 20, bottom: 20, left: 0, right: 0 }

    return (<View>
      <Text>Some text</Text>
      <SafeAreaView style={{flex: 1}}>
        <View style={{height: 200, flexDirection: 'row'}}>
            <YAxis
                data={ data }
                formatLabel={ value => `${value}` }
                contentInset={{top: 20, bottom: 20}}
                svg={{
                    fill: 'grey',
                    fontSize: 10,
                }}
                numberOfTicks={ 10 }
            />
            <LineChart
                style={{ flex: 1, marginLeft: 5, marginRight: 10}}
                data={ data }
                svg={{ stroke: 'rgb(134, 65, 244)' }}
                contentInset={{top: 20, bottom: 20}}>
                <Grid/>
            </LineChart>
        </View>
        <XAxis
            data={ data }
            formatLabel={ (value, index) => index }
            contentInset={{ left: 30, right: 10 }}
            svg={{ fontSize: 10, fill: 'black' }}
        />
    </SafeAreaView>  
    </View>)
  }
  intrest = () => {
    const data = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80]

    return (<View>
      <Text>Some text</Text>
      <AreaChart
                style={{ height: 200 }}
                data={data}
                contentInset={{ top: 30, bottom: 30 }}
                curve={shape.curveNatural}
                svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}
            >
                <Grid />
            </AreaChart>
    </View>)
  }

  render() {
    return (
        <ScrollView style={styles.container}>
            {this.addiction()}
        </ScrollView>
    );
  }
}

ChildScreen.navigationOptions = {
  title: 'Good Child',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
