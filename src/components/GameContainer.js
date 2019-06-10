import React, { Component } from 'react'
import Gallows from './Gallows';
import StartBtn from './StartBtn'
import WordContainer from './WordContainer';
import ScoreBox from './ScoreBox';
import { Grid } from 'semantic-ui-react'
import GameOverModal from './GameOverModal';
import LeaderBoard from './LeaderBoard'
import {api_base,dictionary_url} from '../apiUri.js'

export default class GameContainer extends Component {
    constructor(props) {
      super(props)
      this.state = {
         guesses: [],
         letters: [ ],
         definition: "",
         started: false,
         wrongGuesses: 0,
         correctGuesses: 0,
         score: 0,
         allTimeScore: 0,
         leaders: []
      }
    }
    gameWon(){
      if(this.state.letters.length > 0){
        return this.state.guesses.every((letter,index)=>{
          //does EVERY letter of guesses match the letter of LETTERS
          return letter === this.state.letters[index]
        })
      }else{
        return false
      }
    }
    gameLost(){
     return this.state.wrongGuesses === 6
    }
    gameOver(){
      return this.gameWon() || this.gameLost()
    }
    resetGame = ()=>{
      this.setGame()
      
      
      this.setState({
        guesses: [],
        letters: [ ],
        definition: "",
        started: false,
        wrongGuesses: 0,
        correctGuesses: 0,
        score: 0
       })
    }

    updateLeaders = (e) => {
      fetch(api_base + '/leaders')
      .then(res => res.json())
      .then(data => {
          this.setState({leaders: data})
      })
    }


    handleGuess = (event) => {
      //get the button that was pressed
      const guessLetter = event.key

      console.log("guessing..",guessLetter)
      let isGuessCorrect = false
      const newGuesses = this.state.letters.map((letter,index)=>{
        if(guessLetter === letter){
          isGuessCorrect = true
          return letter
        }else{
          return this.state.guesses[index]
        }
      })
      if(isGuessCorrect){
        this.setState({
          guesses: newGuesses,
          correctGuesses: this.state.correctGuesses + 1,
          score: this.state.score + 5
        })
      }else{
        this.setState({
          guesses: newGuesses,
          wrongGuesses: this.state.wrongGuesses + 1,
          score: this.state.score - 5
        })
      }

    }


    getWord= ()=>{
      fetch(dictionary_url)
      .then(resp =>{
        if(!resp.ok){
          alert("Problem getting new word")
          throw Error
        }
        return resp.json()
      })
      .then(data=>{
        data.list.sort((word1,word2)=>{
          //sort by descending thumbs up
          //ie: word with most thumbs up is first
          if(word1.thumbs_up > word2.thumbs_up)
          return -1
          if(word1.thumbs_up < word2.thumbs_up)
          return 1
          return 0
        })
        console.log('data', data.list)
        //use the most popular random word
        //but it has to be 16 characters long or less
        const wordObj = data.list.find(item=>item.word.length < 17) 
        const letters = wordObj.word.toLowerCase().split("")
        //put any spaces into the guesses array
        const guesses = letters.map(letter=>letter===" "? " ": "")
        
        this.setState({
          letters: letters,
          guesses: guesses,
          definition: wordObj.definition
        })
      })
    }
    startGame = ()=>{
      this.setState({started: true})
      this.getWord()
    }

  componentDidMount(){
    const token = localStorage.getItem("token")
    fetch(api_base + "/score",{
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({token: token})
    })
    .then(res=>{
      if(res.ok){
        return res.json()
      }
    })
    .then(data=>this.setState({allTimeScore: data.total_score}))
    this.updateLeaders()
  }

   


  setGame = () => {
    const newGame = {
      "token": localStorage.getItem("token"),
      "game": {"score": this.state.score, 
                "word": this.state.letters.join(""),
                "definition": this.state.definition}
    }
    
    fetch(api_base + "/games", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newGame)
    })
    .then(res => {
      if(res.ok)
      return res.json()})
      .then(data => {
        console.log(data)
        this.updateLeaders()
        this.setState({allTimeScore: data.total_score})
    })
  }

  render() {
    return (
      
      <div>
        <Grid celled>
          <Grid.Row>
            <Grid.Column width={3} verticalAlign='left'>
              <LeaderBoard leaders={this.state.leaders}/>
            </Grid.Column>
            <Grid.Column width={10}>
              <Gallows guesses={this.state.wrongGuesses} />
            </Grid.Column>
            <Grid.Column  width={3} verticalAlign='middle'>
              <ScoreBox score={this.state.score} allTimeScore={this.state.allTimeScore}/>
            </Grid.Column>
          </Grid.Row>
        
          <Grid.Row >
            <Grid.Column width={16}>
            {this.state.started 
              ? <>
            <WordContainer 
            definition={this.state.definition} 
            letters={this.state.guesses} 
            handleGuess={this.handleGuess}/>
          <button className="ui button" onClick={this.getWord}>Nope, next word please!</button>
          </>
          : 
          <StartBtn 
          handleStart={this.startGame}/>
        }
          </Grid.Column>
          </Grid.Row>
        </Grid>
          
        <GameOverModal 
        modalOpen={this.gameOver()}
        handleClose={this.resetGame}
        won={this.gameWon()} 
        word={this.state.letters.join("")}
        score={this.state.allTimeScore + this.state.score}
        definition={this.state.definition}/>
      </div>
    )
  }
}
