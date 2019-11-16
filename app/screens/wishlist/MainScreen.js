import React from 'react';
import { Button, FlatList, Image, ScrollView, StyleSheet, View, TouchableOpacity, Text, ImageStore } from 'react-native';
import { Card, ListItem, Icon } from 'react-native-elements';

export default class MainWishListScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex: 1,
            items: [
                { key: "Hi", content: "garbage", price: 5 },
                { key: "Bye", content: "rubbish", price: 5 },
                { key: "Ok", content: "trash", price: 5 },
                { key: "Hi1", content: "junk", price: 5 },
                { key: "Bye1", content: "coke", price: 5 },
                { key: "Ok1", content: "filler", price: 5 },
                { key: "Hi2", content: "car", price: 5 },
                { key: "Bye2", content: "coke", price: 5 },
                { key: "Ok2", content: "filler", price: 5 },
                { key: "Hi3", content: "car", price: 5 },
                { key: "Bye3", content: "coke", price: 5 },
                { key: "Ok3", content: "filler", price: 5 },
            ]
        }
    }

    renderItem({ item, index }) {

        // let title = 
        let content = index == 0 ? item.content : item.key;

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
                title='VIEW NOW' />
        </Card >
    }

    render() {
        return (
            <ScrollView styles={styles.container}>
                <FlatList
                    numColumns={3}
                    contentContainerStyle={styles.list}
                    data={this.state.items}
                    renderItem={this.renderItem}
                />
            </ScrollView>
        )
    }
}

MainWishListScreen.navigationOptions = {
    title: 'Wish List',
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 0
    },
    list: {
        justifyContent: 'center'
    },
    wish: {
        margin: "1%",
        width: "30%",
        backgroundColor: "#F1F1F1"
    },
    wishImage: {
        flex: 1,
        width: 50,
        height: 50
    }
});
