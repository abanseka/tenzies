import React from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import { BiVolumeFull, BiVolumeMute } from "react-icons/bi";
import {
  CgDice1,
  CgDice2,
  CgDice3,
  CgDice4,
  CgDice5,
  CgDice6,
} from "react-icons/cg";

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
      const winningValue = die.isHeld && die.dieFace;
      allDiceValue = dice.every(
        (die) => die.dieFace === winningValue && die.isHeld
      );
    });

    if (allDiceValue) {
      setTenzies(!tenzies);
    } else return;
  }, [dice]);

  function generateDie() {
    let die = {
      id: "",
      value: "",
    };
    const random = Math.ceil(Math.random() * 6);
    switch (random) {
      case 1:
        die = {
          id: 1,
          value: <CgDice1 />,
        };
        break;
      case 2:
        die = {
          id: 2,
          value: <CgDice2 />,
        };
        break;
      case 3:
        die = {
          id: 3,
          value: <CgDice3 />,
        };
        break;
      case 4:
        die = {
          id: 4,
          value: <CgDice4 />,
        };
        break;
      case 5:
        die = {
          id: 5,
          value: <CgDice5 />,
        };
        break;
      case 6:
        die = {
          id: 6,
          value: <CgDice6 />,
        };
        break;
    }
    return {
      value: die.value,
      dieFace: die.id,
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
    soundOn && playvictory.pause();
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
