import React, { useState, useEffect } from "react"
import useSound from 'use-sound'
import 'bpg-arial/css/bpg-arial.css'
import './App.css';
import { words } from './words';
import correctAudio from './assets/sounds/correct.wav'
import incorrectAudio from './assets/sounds/incorrect.wav'

console.log(111, correctAudio, incorrectAudio)

const Spacing = ({ children }) => (
  <div
    style={{
      marginBottom: "15px",
    }}
  >
    {children}
  </div>
)

// var correctAudio = new Audio('/assets/sounds/correct.wav');

const App = () => {
  const secondValues = [
    { value: 3, name: "30 წამი" },
    { value: 6, name: "1 წუთი", defaultValue: true },
    { value: 9, name: "1 წუთი და 30 წამი" },
    { value: 12, name: "2 წუთი" },
  ]
  const scoreToWinValues = [
    { value: 15 },
    { value: 2,  defaultValue: true },
    { value: 3 },
    { value: 4 },
    { value: 6 },
  ]
  const [playCorrect] = useSound(correctAudio);
  const [playIncorrect] = useSound(incorrectAudio);
  const [settingsOpen, setSettingsOpen] = useState(true)
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
    setSettingsOpen(false)

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
    <div className="App" style={{ display: "flex", flexDirection: "column", maxWidth: "300px", margin: "auto", padding: "30px" }}>
      {!gameStarted && (
        <div>
          <div>

            <Spacing>
              <button onClick={() => setSettingsOpen(!settingsOpen)}>
                <div>პარამეტრები</div>

                <div>
                  {settingsOpen ? <>&#581;</> : "V"}
                </div>
              </button>
            </Spacing>


            {settingsOpen &&
              (
                <>
                  <Spacing>
                    <label htmlFor="firstName">გუნდი #1 სახელი: </label>
                    <input id="firstName" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
                  </Spacing>

                  <Spacing>
                    <label htmlFor="secondName">გუნდი #2 სახელი: </label>
                    <input id="secondName" value={secondName} onChange={(event) => setSecondName(event.target.value)} />
                  </Spacing>

                  <Spacing>
                    <label htmlFor="timeLeft">დრო: </label>
                    <select id="timeLeft" value={timeLeftInitial} onChange={(event) => setTimeLeftInitial(event.target.value)}>
                      {secondValues.map(({ value, name }) => (
                        <option key={value} value={value} >{name}</option>
                      ))}
                    </select>
                  </Spacing>

                  <Spacing>
                    <label htmlFor="scoreToWin">სანამდე: </label>
                    <select id="scoreToWin" value={scoreToWinInitial} onChange={(event) => setScoreToWinInitial(event.target.value)}>
                      {scoreToWinValues.map(({ value, name }) => (
                        <option key={value} value={value} >{value} ქულამდე</option>
                      ))}
                    </select>
                  </Spacing>
                </>
              )
            }
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

              <button
                onClick={() => {
                  playCorrect()

                  endGuessingWord(true)
                }}>
                  სწორია
                </button>

              <button
                onClick={() => {
                  playIncorrect()

                  endGuessingWord(false)
                }}>
                  არასწორია
                </button>

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
