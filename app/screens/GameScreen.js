import React from 'react';
import { Button, FlatList, Image, ScrollView, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import * as Permissions from 'expo-permissions';

import { createUser, getToken, getQuestion } from '../authentication/Authentication.js';

export default class GameScreen extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      questionImage: 'https://miro.medium.com/max/1080/0*DqHGYPBA-ANwsma2.gif',
      questionString: '',
      questionOptions: [],
      questionAnswer: 0,
      questionReward: 0,
      showAnswerKeys: false
    };
    this.fetchQuestion  = this.fetchQuestion.bind(this);
    this.answerQuestion = this.answerQuestion.bind(this);
    this.sendReward = this.sendReward.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.renderAnswer = this.renderAnswer.bind(this);
  }

  async componentDidMount() {
    this.token = await getToken("frederik", "pw123456");
    this.nextQuestion(); 
  }

  async fetchQuestion() {
    // Fetch some question from the API
    const questionData = await getQuestion(this.token);
    console.log("Fetching...");
    this.setState({ 
      questionImage: questionData.image_url,
      questionString: questionData.text, 
      questionOptions: questionData.options,
      questionAnswer: questionData.correct_answer,
      questionReward: questionData.reward,
    });
  }

  answerQuestion(questionId) {
    console.log(questionId, this.state.questionAnswer);
    if (questionId == this.state.questionAnswer) {
      this.sendReward(() => this.nextQuestion());
    } else {
      // Display failure and load new questions
      this.setState({ showAnswerKeys: true }, () => {
        setTimeout(function() {
          this.nextQuestion();
        }.bind(this), 2000);
      });
    }
  }

  sendReward(next) {
    // Send some reward via the web api
    next();
  }

  nextQuestion() {
    this.setState({ showAnswerKeys: false });
    this.fetchQuestion();
  }

  renderAnswer({ item, index }) {
    let styleAnswerKeys = {};
    if (this.state.showAnswerKeys) {
      styleAnswerKeys = (index == this.state.questionAnswer) ? styles.success : styles.error;
    }

    let buttonColor = (this.state.showAnswerKeys) ? '#FFF' : '#000';
    return (
      <View style={Object.assign({}, styles.questionGuess, styleAnswerKeys)}>
        <Button 
          onPress={() => this.answerQuestion(index)}
          title={item.key}
          color={buttonColor}
        />
      </View>
    )
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.containerImage}>
          <Image style={{width: 200, height: 250}} source={{uri: this.state.questionImage}}/>
        </View>
        <View style={styles.containerText}>
          <Text style={styles.questionText}>{this.state.questionString}</Text>
        </View>
        <FlatList
          numColumns={2}
          contentContainerStyle={styles.list}
          data={this.state.questionOptions}
          renderItem={this.renderAnswer}
          extraData={this.state.showAnswerKeys}
        />
      </ScrollView>
    );
  }
}

GameScreen.navigationOptions = {
  title: 'Game',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: '#fff',
  },
  containerImage: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: '#fff',
    alignSelf: 'center',
    paddingTop:10,
  },
  containerText: {
    textAlign: 'center',
    padding: 15,
    backgroundColor: '#fff',
  },
  questionText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  list: {
    justifyContent: 'center'
  },
  questionGuess: {
    margin: "1%",
    width: "48%",
    paddingTop: 20,
    paddingBottom: 20,
    borderColor: '#CCC',
    borderWidth: 1,
    backgroundColor: '#FFF',
  },
  error: {
    backgroundColor: '#FF0000',
    color: '#FFF'
  },
  success: {
    backgroundColor: '#00FF00',
    color: '#FFF'
  }
});
