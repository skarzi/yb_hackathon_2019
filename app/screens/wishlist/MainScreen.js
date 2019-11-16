import React from 'react';
import { Button, FlatList, Image, ScrollView, StyleSheet, View, TouchableOpacity, Text, ImageStore, SafeAreaView } from 'react-native';
import { Card, ListItem, Icon } from 'react-native-elements';

export default class MainWishListScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex: 1,
            balance: 13,
            tmpBalance: 13,
            ratio: 1.0,
            items: [
                { key: "Hi", content: "garbage", price: 5, selected: false },
                { key: "Bye", content: "rubbish", price: 5, selected: false },
                { key: "Ok", content: "trash", price: 5, selected: false },
                { key: "Hi1", content: "junk", price: 5, selected: false },
                { key: "Bye1", content: "coke", price: 5, selected: false },
                { key: "Ok1", content: "filler", price: 5, selected: false },
                { key: "Hi2", content: "car", price: 5, selected: false },
                { key: "Bye2", content: "coke", price: 5, selected: false },
                { key: "Ok2", content: "filler", price: 5, selected: false },
                { key: "Hi3", content: "car", price: 5, selected: false },
                { key: "Bye3", content: "coke", price: 5, selected: false },
                { key: "Ok3", content: "filler", price: 5, selected: false },
            ]
        };
        this.renderthing = this.renderthing.bind(this);
        this.toggleItem = this.toggleItem.bind(this);
    }

    renderItem = ({ item, index }) => {

        // let title = 
        let content = index == 0 ? item.content : item.key;

        let buttonColor = item.selected ? "#F00" : "#0F0";
        return <Card
            containerStyle={styles.wish}
            title={`${item.content} WORLD `}
            image={require('../../assets/images/logo.png')}
            imageStyle={styles.wishImage}
        >
            <Text style={{ marginBottom: 1 }}>
                Price: ${item.price}
            </Text>
            <Button
                icon={<Icon name='code' color='#ffffff' />}
                buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                onPress={() => this.toggleItem(item, index)}
                color= {buttonColor}
                title='VIEW NOW' />
        </Card >
    }

    canBuy = (item) => {
        return this.state.tmpBalance >= item.price;
    }
    toggleItem = (item, index) =>{

        let updated = [...this.state.items];
        let curr = updated[index];
        let oldSel = curr.selected;
        let newBalance = this.state.tmpBalance;
        if (item.selected) {
            newBalance += item.price;
            updated[index] = {
                ...curr,
                selected: !oldSel
            };
            let newRatio = newBalance / this.state.balance;
            
            this.setState({
                items: updated, tmpBalance: newBalance, ratio: newRatio
        });

        }
        else if (this.canBuy(item))
        {
            newBalance -= item.price;
            
            updated[index] = {
                ...curr,
                selected: !oldSel
            };

            let newRatio = newBalance / this.state.balance;
            this.setState({
                items: updated, tmpBalance: newBalance, ratio: newRatio
            });
        }
    }



    renderthing({ item, index }) {

        let curr = index == 0 ? styles.statusBarRemain : styles.statusBarSpent;
        
        let _width = `${item.val}%`;
        console.log(_width);
        console.log(curr)
        let updated = Object.assign({}, { width: _width }, curr);
        console.log(updated);


        return (
            <View style={updated} />
        )
    }

    getStatusBar = () => {
        let value = parseInt(100.0 *this.state.ratio)
        let ratio = [{ key: 0, val: value }, { key: 1, val: 100 - value }];
        console.log("status" + ratio);
        return ratio;
    }

    render() {
        return (
            <SafeAreaView styles={styles.container}>
                <Card title={`Budget: \$${this.state.tmpBalance}`} containerStyle={styles.topcardContainer}>

                <View
                    styles={styles.statusBarContainer}
                    >
                
                <FlatList
                    numColumns={2}
                    contentContainerStyle={styles.list}
                    data={this.getStatusBar()}
                    renderItem={this.renderthing}
                    extraData={this.state}
                    />
                </View>
                    </Card>
                
                <ScrollView styles={styles.container}>
                    <FlatList
                        numColumns={2}
                        contentContainerStyle={styles.list}
                        data={this.state.items}
                        renderItem={this.renderItem}
                        />
                </ScrollView>
            </SafeAreaView>
        )
    }
}

MainWishListScreen.navigationOptions = {
    title: 'Wish List',
};

const styles = StyleSheet.create({
    topcardContainer: {
        width: "100%",
        margin:0
    },
    container: {
        flex: 1,
        paddingTop: 0
    },
    list: {
        justifyContent: 'center'
    },
    wish: {
        margin: "1%",
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: "#F1F1F1"
    },
    wishImage: {
        flex: 1,
        width: 50,
        height: 50
    },
    statusBarContainer: {
        margin:"5%",
        width: "90%",
        height: "20",
        padding: 0,
        marginBottom: 5
    },
    statusBarRemain: {
        padding: 0,
        margin:0,
        height: "100%",
        backgroundColor: "#12cc12"
    },
    statusBarSpent: {
        padding: 0,
        margin: 0,
        height: 20,
        backgroundColor: "#cc1212"
    }
});
