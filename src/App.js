import React, { useState, useEffect } from "react"
import useSound from 'use-sound'
import 'bpg-arial/css/bpg-arial.css'
import './App.css';
import { words } from './words';
import correctAudio from './assets/sounds/correct.wav'
import incorrectAudio from './assets/sounds/incorrect.wav'

const Spacing = ({ children, style = {} }) => (
  <div
    style={{
      marginBottom: "15px",
      ...style,
    }}
  >
    {children}
  </div>
)

const StartButton = ({ children, style = {}, ...rest }) => (
  <button
    style={{
      padding: "12px",
      fontSize: "15px",
      fontWeight: "600",
      background: "#865f18",
      border: "none",
      outline: "0",
      borderRadius: "10px",
      color: "white",
      ...style,
    }}
    {...rest}
  >
    {children}
  </button>
)

const CorrectnessButton = ({ children, style = {}, ...rest }) => (
  <button
    style={{
      color: "white",
      borderRadius: "50%",
      outline: "0",
      margin: "25px",
      padding: "22px 30px",
      fontSize: "40px",
      ...style,
    }}
    {...rest}
  >
    {children}
  </button>
)

const ScoreCell = ({ children, style = {}, ...rest }) => (
  <div
    style={{
      padding: "12px",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      ...style,
    }}
    {...rest}
  >
    {children}
  </div>
)

const App = () => {
  const secondValues = [
    { value: 30, name: "30 წამი" },
    { value: 6, name: "1 წუთი", defaultValue: true },
    { value: 90, name: "1 წუთი და 30 წამი" },
    { value: 120, name: "2 წუთი" },
  ]
  const scoreToWinValues = [
    { value: 15 },
    { value: 20,  defaultValue: true },
    { value: 30 },
    { value: 40 },
    { value: 60 },
  ]

  const firstNameInitial = "ლომები"
  const secondNameInitial = "მგლები"
  const [playCorrect] = useSound(correctAudio);
  const [playIncorrect] = useSound(incorrectAudio);
  const [settingsOpen, setSettingsOpen] = useState(true)
  const [timeLeftInitial, setTimeLeftInitial] = useState(secondValues.filter(({ defaultValue }) => defaultValue)[0].value)
  const [scoreToWinInitial, setScoreToWinInitial] = useState(scoreToWinValues.filter(({ defaultValue }) => defaultValue)[0].value)
  const [firstName, setFirstName] = useState(firstNameInitial)
  const [secondName, setSecondName] = useState(secondNameInitial)
  const [firstScore, setFirstScore] = useState(0)
  const [secondScore, setSecondScore] = useState(0)
  const [firstScoreHistory, setFirstScoreHistory] = useState([])
  const [secondScoreHistory, setSecondScoreHistory] = useState([])
  const [gameStarted, setGameStarted] = useState(false)
  const [wordToGuess, setWordToGuess] = useState(null)
  const [firstsTurn, setFirstsTurn] = useState(true)
  const [timeLeft, setTimeLeft] = useState(timeLeftInitial)
  const [scoreToWin, setScoreToWin] = useState(scoreToWinInitial)
  const [winnerTeam, setWinnerTeam] = useState(null)
  const [afterTurnActionsHappened, setAfterTurnActionsHappened] = useState(false)
  const [timerId, setTimerId] = useState(null)

  const getRandomWord = () => words[Math.floor(Math.random() * words.length)];

  const goToStart = () => {
    clearInterval(timerId)

    console.log(333, timerId)

    setSettingsOpen(false)

    setGameStarted(false)
  }

  const sumArray = (arr) => arr.reduce((acc, curr) => acc + curr, 0)

  const startGame = (firstsTurnArg) => {
    setFirstsTurn(firstsTurnArg)
    setFirstScoreHistory([])
    setSecondScoreHistory([])

    const validateTeamName = (teamName) => teamName && teamName.length < 15

    if (!validateTeamName(firstName)) {
      setFirstName(firstNameInitial)
    }
    if (!validateTeamName(secondName)) {
      setSecondName(secondNameInitial)
    }

    startTurn()
  }

  const startTurn = () => {
    setTimeLeft(timeLeftInitial)
    setScoreToWin(scoreToWinInitial)
    setAfterTurnActionsHappened(false)
    setWinnerTeam(null)
    setFirstScore(0)
    setSecondScore(0)

    setWordToGuess(getRandomWord())

    setGameStarted(true)

    setTimerId(
      setInterval(() => {
        setTimeLeft(currentTimeLeft => {
          if (currentTimeLeft === 1) {
            clearInterval(timerId)
          }

          return currentTimeLeft - 1
        })
      }, 1000)
    )
  }

  useEffect(
    () => {
      if (timeLeft === 0 && !afterTurnActionsHappened) {
        setAfterTurnActionsHappened(true)

        setFirstsTurn(currentVal => !currentVal)

        const newScoreHistory = [
          ...(firstsTurn ? firstScoreHistory : secondScoreHistory),
          (firstsTurn ? firstScore : secondScore),
        ]

        ;(firstsTurn ? setFirstScoreHistory : setSecondScoreHistory)(newScoreHistory);

        console.log(999, sumArray(newScoreHistory))

        if (sumArray(newScoreHistory) >= scoreToWin) {
          setWinnerTeam(firstsTurn ? firstName : secondName)
        }
      }
    },

    [
      firstScoreHistory,
      secondScoreHistory,
      afterTurnActionsHappened,
      firstName,
      secondName,
      firstsTurn,
      firstScore,
      secondScore,
      timeLeft,
      timeLeftInitial,
      scoreToWin,
    ]
  )

  const endGuessingWord = (correctGuess) => {
    setWordToGuess(getRandomWord())

    ;(firstsTurn ? setFirstScore : setSecondScore)(currentScore => currentScore + (correctGuess ? 1 : -1));
  }

  return (
    <div
      className="App"
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          width: "calc(100% - 25px)",
          background: "#ffca69",
          fontSize: "25px",
          fontWeight: "bold",
          padding: "20px 0",
          paddingLeft: "25px",
          display: "flex",
          alignItems: "center",
          color: "white",
        }}
      >
        ალიასი
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "320px",
          margin: "auto",
          padding: "30px 15px",
          marginTop: "20px",
          height: "100%",
        }}
      >
        {!gameStarted && (
          <div>
            <div>

              <div>
                <button
                  onClick={() => setSettingsOpen(!settingsOpen)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "10px 20px",
                    outline: "0",
                    border: "1px solid gray",
                    fontSize: "18px",
                    borderTopRightRadius: "10px",
                    borderTopLeftRadius: "10px",
                  }}
                >
                  <div>პარამეტრები</div>

                  <div>
                    {settingsOpen ? <>&#581;</> : "V"}
                  </div>
                </button>
              </div>


              {settingsOpen &&
                (
                  <div
                    style={{
                      padding: "20px 7px 4px",
                      borderBottomRightRadius: "10px",
                      borderBottomLeftRadius: "10px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
                    }}
                  >
                    <Spacing
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <label htmlFor="firstName" style={{ marginRight: "5px" }}>გუნდი #1 სახელი: </label>
                      <input
                        id="firstName"
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                        style={{
                          padding: "10px 2px",
                        }}
                      />
                    </Spacing>

                    <Spacing
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <label htmlFor="secondName" style={{ marginRight: "5px" }}>გუნდი #2 სახელი: </label>
                      <input
                        id="secondName"
                        value={secondName}
                        onChange={(event) => setSecondName(event.target.value)}
                        style={{
                          padding: "10px 2px",
                        }}
                      />
                    </Spacing>

                    <Spacing
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <label htmlFor="timeLeft" style={{ marginRight: "5px" }}>დრო: </label>
                      <select
                        id="timeLeft"
                        value={timeLeftInitial}
                        onChange={(event) => setTimeLeftInitial(event.target.value)}
                        style={{
                          padding: "10px 2px",
                        }}
                      >
                        {secondValues.map(({ value, name }) => (
                          <option key={value} value={value} >{name}</option>
                        ))}
                      </select>
                    </Spacing>

                    <Spacing
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <label htmlFor="scoreToWin" style={{ marginRight: "5px" }}>სანამდე: </label>
                      <select
                        id="scoreToWin"
                        value={scoreToWinInitial}
                        onChange={(event) => setScoreToWinInitial(event.target.value)}
                        style={{
                          padding: "10px 2px",
                        }}
                      >
                        {scoreToWinValues.map(({ value, name }) => (
                          <option key={value} value={value} >{value} ქულამდე</option>
                        ))}
                      </select>
                    </Spacing>
                  </div>
                )
              }
            </div>


            <Spacing style={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
              <StartButton style={{ marginRight: "10px" }} onClick={() => startGame(true)}>{firstName} იწყებენ</StartButton>

              <StartButton onClick={() => startGame(false)}>{secondName} იწყებენ</StartButton>
            </Spacing>
          </div>
        )}

        {gameStarted && (
          <div
            style={{
              height: "100%",
            }}
          >
            {timeLeft === 0 ? (
              <div
                style={{
                  height: "100%",
                }}
              >
                {winnerTeam ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "20px",
                        marginBottom: "25px",
                        display: "flex",
                      }}
                    >
                      მოგებული: <div style={{ fontWeight: "bold", marginLeft: "6px" }}>{winnerTeam}</div>
                    </div>

                    <button
                      onClick={goToStart}
                      style={{
                        padding: "35px",
                        borderRadius: "50%",
                        fontSize: "20px",
                        color: "white",
                        background: "#ca9534",
                        border: "none",
                        width: "fit-content",
                      }}
                    >
                      კიდე თამაში
                    </button>
                  </div>
                ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <button
                    onClick={startTurn}
                    style={{
                      padding: "35px",
                      borderRadius: "50%",
                      fontSize: "20px",
                      color: "white",
                      background: "#ca9534",
                      border: "none",
                    }}
                  >
                    <div>
                      დაწყება,
                    </div>

                    <div>
                      {firstsTurn ? firstName : secondName}
                    </div>
                  </button>
                </div>
                )}

                <div
                  style={{
                    padding: "20px",
                    marginTop: "60px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      borderBottom: "1px solid gray",
                    }}
                  >
                    <ScoreCell
                      style={{
                        borderRight: "1px solid gray",
                      }}
                    >
                      {firstName}
                    </ScoreCell>

                    <ScoreCell>
                      {secondName}
                    </ScoreCell>
                  </div>

                  {firstScoreHistory.map((currentScore, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                      }}
                    >
                      <ScoreCell
                        style={{
                          borderRight: "1px solid gray",
                        }}
                      >
                        {currentScore}
                      </ScoreCell>

                      <ScoreCell>
                        {secondScoreHistory[index]}
                      </ScoreCell>
                    </div>
                  ))}

                  <div
                    style={{
                      display: "flex",
                      borderTop: "1px solid gray",
                    }}
                  >
                    <ScoreCell
                      style={{
                        borderRight: "1px solid gray",
                      }}
                    >
                      {sumArray(firstScoreHistory)}
                    </ScoreCell>

                    <ScoreCell>
                      {sumArray(secondScoreHistory)}
                    </ScoreCell>
                  </div>
                </div>
            </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Spacing
                  style={{
                    marginBottom: "38px",
                    color: "#a0a0a0",
                    fontSize: "22px",
                    padding: "15px 17px",
                    borderRadius: "50%",
                    border: "2px solid #cccccc",
                  }}
                >
                  {timeLeft}
                </Spacing>

                <Spacing
                  style={{
                    marginBottom: "15px",
                    fontSize: "35px",
                    background: "rgb(255 249 237)",
                    padding: "20px",
                    borderRadius: "15px",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {wordToGuess}
                </Spacing>

                <Spacing>
                  <CorrectnessButton
                    onClick={() => {
                      playIncorrect()

                      endGuessingWord(false)
                    }}
                    style={{
                      background: "#ff8181",
                      border: "none",
                    }}
                  >
                    &#10005;
                  </CorrectnessButton>

                  <CorrectnessButton
                    onClick={() => {
                      playCorrect()

                      endGuessingWord(true)
                    }}
                    style={{
                      background: "#76de76",
                      border: "none",
                    }}
                  >
                    &#10003;
                  </CorrectnessButton>
                </Spacing>

                <button
                  style={{
                    marginTop: "auto",
                    border: "none",
                    padding: "10px",
                    borderRadius: "10px",
                    color: "dimgrey",
                  }}
                  onClick={goToStart}
                >
                  გათიშვა
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div
        style={{
          width: "100%",
          height: "45px",
          background: "#ffca69",
          bottom: "0",
          color: "#ffca69",
        }}
      >
        not visible
      </div>
    </div>
  );
}

export default App;
