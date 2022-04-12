import { useState, useEffect } from "react";

import Die from "./Die";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import { BiVolumeFull, BiVolumeMute } from "react-icons/bi";

import playShuffle from "../assets/PlayHoldDice.wav";
import playTap from "../assets/PlayTap.wav";
import playVictory from "../assets/playVictory.wav";
import generateDie from "./GenerateDie";

export default function App() {
  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const playshuffle = new Audio(playShuffle);
  const playtap = new Audio(playTap);
  const playvictory = new Audio(playVictory);

  tenzies && soundOn && playvictory.play();

  useEffect(() => {
    let allDiceValue;
    dice.forEach((die, _, dice) => {
      const winningValue = die.isHeld && die.dieFace;
      allDiceValue = dice.every(
        (die) => die.dieFace === winningValue && die.isHeld
      );
    });

    if (allDiceValue) {
      setTenzies(!tenzies);
    } else return;
  }, [dice]);

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateDie());
    }
    return newDice;
  }

  function rollDice() {
    // prettier-ignore
    soundOn && playshuffle.play()
    setDice((prevDice) =>
      prevDice.map((dice) =>
        dice.isHeld ? { ...dice, value: dice.value } : generateDie()
      )
    );
  }

  function holdDice(id) {
    // prettier-ignore
    soundOn && playtap.play()
    setDice((oldDice) =>
      oldDice.map((die) =>
        die.id === id ? { ...die, isHeld: !die.isHeld } : die
      )
    );
  }

  const diceElements = dice.map((die) =>
    // prettier-ignore
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  );

  function newGame() {
    setDice(allNewDice());
    setTenzies(false);
    soundOn && playvictory.pause();
  }

  const { width, height } = useWindowSize();

  return (
    <main>
      {tenzies && <Confetti width={width} height={height} />}
      <h2 className="heading">🎲 10-Zee's 🎲</h2>
      <p className="text">
        Roll🎲 until all dice are the same. Click each die to freeze🧊 it at its
        current value between rolls 😜.
      </p>
      <div className="dice-container">{diceElements}</div>
      <footer>
        <button
          className="roll-dice"
          onMouseDown={tenzies ? newGame : rollDice}
        >
          {tenzies ? "New Game" : "Roll 🧻"}
        </button>
        <button
          className="volume-btn"
          onMouseDown={() =>
            setSoundOn((sound) => {
              playtap.play();
              return !sound;
            })
          }
        >
          {soundOn ? <BiVolumeFull /> : <BiVolumeMute />}
        </button>
      </footer>
    </main>
  );
}
