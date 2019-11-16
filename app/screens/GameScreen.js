import React from 'react';
import { Button, FlatList, Image, ScrollView, StyleSheet, View, TouchableOpacity, TouchableHighlight,Text, SafeAreaView } from 'react-native';
import * as Permissions from 'expo-permissions';
import { setLightEstimationEnabled } from 'expo/build/AR';

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
      showAnswerKeys: false,
      selectedAnswer: -1
    };
    this.fetchQuestion  = this.fetchQuestion.bind(this);
    this.answerQuestion = this.answerQuestion.bind(this);
    this.fetchQuestion = this.fetchQuestion.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.renderAnswer = this.renderAnswer.bind(this);
    this.selectAnswer = this.selectAnswer.bind(this);
    this.sendReward = this.sendReward.bind(this);
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
      showAnswerKeys: false,
      selectedAnswer: -1,
      questionImage: questionData.image_url,
      questionString: questionData.text, 
      questionOptions: questionData.options,
      questionAnswer: questionData.correct_answer,
      questionReward: questionData.reward,
    });
  }

  answerQuestion(questionId) {
    if (questionId < 0) return;
    if (questionId == this.state.questionAnswer) {
      
      this.setState({ showAnswerKeys: true }, () => {
        setTimeout(function () { this.sendReward(() => this.nextQuestion()); }.bind(this), 1000);
      }
      
      );
      
      
    } else {
      // Display failure and load new questions
      this.setState({ showAnswerKeys: true }, () => {
        setTimeout(function () {
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
    // this.setState({ showAnswerKeys: false, selectAnswer: -1 });
    this.fetchQuestion();
  }

  selectAnswer( index ) {
    let value = (index == this.state.selectedAnswer) ? -1 : index;
    this.setState({ selectedAnswer: value });
  }

  renderAnswer({ item, index }) {
    let curr = [styles.questionGuess];
    if (this.state.showAnswerKeys) {
      if (index == this.state.questionAnswer) {
        curr.push(styles.success);
      }
      else if (index == this.state.selectedAnswer) {
        curr.push(styles.error);
      }
    }

    let buttonColor = '#777';
    if( this.state.selectedAnswer == index)
    {
      curr.push(styles.selected);
    }
    return (
      <View style={curr}>
        <Button
          onPress={() => this.selectAnswer(index)}
          title={item.key}
          color={buttonColor}
        />
      </View>
    )
  }


  getSubmitStyle() {
    if (this.state.selectedAnswer == -1) {
      let style = Object.assign({},styles.bottom, styles.submit, { backgroundColor: "#777" });

      return style; 
    }
    else return styles.submit;
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.containerImage}>
          <Image style={{ width: 200, height: 250 }} source={{ uri: this.state.questionImage }} />
        </View>
        <View style={styles.containerText}>
          <Text style={styles.questionText}>{this.state.questionString}</Text>
        </View>

        <FlatList
          numColumns={2}
          contentContainerStyle={styles.list}
          data={this.state.questionOptions}
          renderItem={this.renderAnswer}
          extraData={this.state}
        />
        <View
          style={styles.bottom}>
      
          <Button
            title={`Submit`}
            style={styles.submit}
            color={this.getSubmitStyle().backgroundColor}
            onPress={() =>
              this.answerQuestion(this.state.selectedAnswer)
            }
          />
        </View>
      </SafeAreaView>
    );
  }

  
}

GameScreen.navigationOptions = {
  title: 'Game',
};

const styles = StyleSheet.create({
  submit: {
    flex: 1,
    color: "#FFF",
    backgroundColor: "#1212cc"
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 36,
    // backgroundColor: "#12FF12"
  },
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
    paddingTop: 10,
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
    borderWidth: 2,
    borderRadius: 2,
    backgroundColor: '#FFF',
  },
  selected: {
    borderColor: "#55a",
  },
  error: {
    backgroundColor: '#bb1010',
    color: '#FFF'
  },
  success: {
    backgroundColor: '#10bb10',
    color: '#FFF'
  }
});
