import React from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import { BiVolumeFull, BiVolumeMute } from "react-icons/bi";

import playShuffle from "../assets/PlayHoldDice.wav";
import playTap from "../assets/PlayTap.wav";
import playVictory from "../assets/playVictory.wav";

export default function App() {
  const [dice, setDice] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);
  const [soundOn, setSoundOn] = React.useState(true);
  const playshuffle = new Audio(playShuffle);
  const playtap = new Audio(playTap);
  const playvictory = new Audio(playVictory);

  tenzies && soundOn && playvictory.play();

  React.useEffect(() => {
    let allDiceValue;
    dice.forEach((die, _, dice) => {
      const winningValue = die.isHeld && die.value;
      allDiceValue = dice.every(
        (die) => die.value === winningValue && die.isHeld
      );
    });

    if (allDiceValue) {
      setTenzies(!tenzies);
    } else return;
  }, [dice]);

  function generateDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

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
    !soundOn && playvictory.pause();
  }

  const { width, height } = useWindowSize();

  return (
    <main>
      {tenzies && <Confetti width={width} height={height} />}
      <h2 className="heading">Tenzies</h2>
      <p className="text">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <footer>
        <button className="roll-dice" onClick={tenzies ? newGame : rollDice}>
          {tenzies ? "New Game" : "Roll"}
        </button>
        <button
          className="volume-btn"
          onClick={() =>
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
