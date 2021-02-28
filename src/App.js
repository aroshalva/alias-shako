import React, { useState, useEffect } from "react"
import './App.css';
import { words } from './words';

const App = () => {
  const secondValues = [
    { value: 3, name: "30 წამი" },
    { value: 6, name: "1 წუთი", defaultValue: true },
    { value: 9, name: "1 წუთი და 30 წამი" },
    { value: 12, name: "2 წუთი" },
  ]
  const scoreToWinValues = [
    { value: 15 },
    { value: 20,  defaultValue: true },
    { value: 30 },
    { value: 40 },
    { value: 60 },
  ]
  const [gamePlayedAtLeastOnce, setGamePlayedAtLeastOnce] = useState(false)
  const [timeLeftInitial, setTimeLeftInitial] = useState(secondValues.filter(({ defaultValue }) => defaultValue)[0].value)
  const [scoreToWinInitial, setScoreToWinInitial] = useState(scoreToWinValues.filter(({ defaultValue }) => defaultValue)[0].value)
  const [firstName, setFirstName] = useState("ლომები")
  const [secondName, setSecondName] = useState("მგლები")
  const [firstScore, setFirstScore] = useState(0)
  const [secondScore, setSecondScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [wordToGuess, setWordToGuess] = useState(null)
  const [firstsTurn, setFirstsTurn] = useState(true)
  const [timeLeft, setTimeLeft] = useState(timeLeftInitial)
  const [scoreToWin, setScoreToWin] = useState(scoreToWinInitial)
  const [winnerTeam, setWinnerTeam] = useState(null)
  const [afterTurnActionsHappened, setAfterTurnActionsHappened] = useState(false)

  const getRandomWord = () => words[Math.floor(Math.random() * words.length)];

  const goToStart = () => {
    setGamePlayedAtLeastOnce(true)

    setGameStarted(false)
  }

  const startGame = (firstsTurnArg) => {
    setFirstsTurn(firstsTurnArg)
    setFirstScore(0)
    setSecondScore(0)

    startTurn()
  }

  const startTurn = () => {
    setTimeLeft(timeLeftInitial)
    setScoreToWin(scoreToWinInitial)
    setAfterTurnActionsHappened(false)
    setWinnerTeam(null)

    setWordToGuess(getRandomWord())

    setGameStarted(true)

    const timerId = setInterval(() => {

      setTimeLeft(currentTimeLeft => {
        if (currentTimeLeft === 0) {
          clearInterval(timerId)

          return currentTimeLeft
        }

        return currentTimeLeft - 1
      })
    }, 1000)
  }

  useEffect(() => {
    if (timeLeft === 0 && !afterTurnActionsHappened) {
      setAfterTurnActionsHappened(true)

      setFirstsTurn(currentVal => !currentVal)

      if ((firstsTurn ? firstScore : secondScore) >= scoreToWin) {
        setWinnerTeam(firstsTurn ? firstName : secondName)
      }
    }
  }, [afterTurnActionsHappened, firstName, secondName, firstsTurn, firstScore, secondScore, timeLeft, timeLeftInitial, scoreToWin])

  const endGuessingWord = (correctGuess) => {
    setWordToGuess(getRandomWord())

    ;(firstsTurn ? setFirstScore : setSecondScore)(currentScore => currentScore + (correctGuess ? 1 : -1));
  }

  return (
    <div className="App" style={{ display: "flex", flexDirection: "column", maxWidth: "300px", margin: "auto" }}>
      {!gameStarted && (
        <div>
          <div>
            <label htmlFor="firstName">გუნდი #1 სახელი: </label>
            <input id="firstName" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
          </div>

          <div>
            <label htmlFor="secondName">გუნდი #2 სახელი: </label>
            <input id="secondName" value={secondName} onChange={(event) => setSecondName(event.target.value)} />
          </div>

          <div>
            <label htmlFor="timeLeft">დრო: </label>
            <select id="timeLeft" value={timeLeftInitial} onChange={(event) => setTimeLeftInitial(event.target.value)}>
              {secondValues.map(({ value, name }) => (
                <option key={value} value={value} >{name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="scoreToWin">სანამდე: </label>
            <select id="scoreToWin" value={scoreToWinInitial} onChange={(event) => setScoreToWinInitial(event.target.value)}>
              {scoreToWinValues.map(({ value, name }) => (
                <option key={value} value={value} >{value} ქულამდე</option>
              ))}
            </select>
          </div>


          <button onClick={() => startGame(true)}>{firstName} იწყებენ</button>

          <button onClick={() => startGame(false)}>{secondName} იწყებენ</button>
        </div>
      )}

      {gameStarted && (
        <div>
          {timeLeft === 0 ? (
            <div>
              {winnerTeam ? (
                <div>
                  <div>მოგებული: {winnerTeam}</div>

                  <button onClick={goToStart}>კიდე თამაში</button>
                </div>
              ) : (
               <div>
                 <button onClick={startTurn}>{firstsTurn ? firstName : secondName}, დაწყება</button>
               </div>
              )}
           </div>
          ) : (
            <div>
              <div>
                {timeLeft}
              </div>

              <div>
                {wordToGuess}
              </div>

              <button onClick={() => endGuessingWord(true)}>სწორია</button>

              <button onClick={() => endGuessingWord(false)}>არასწორია</button>

              <div>
                პირველის ქულა: {firstScore}
              </div>

              <div>
                მეორეს ქულა: {secondScore}
              </div>

              <button onClick={goToStart}>თავიდან</button>
            </div>
          )}
        </div>

      )}
    </div>
  );
}

export default App;
