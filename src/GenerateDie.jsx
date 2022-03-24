import { nanoid } from "nanoid";
import {
  CgDice1,
  CgDice2,
  CgDice3,
  CgDice4,
  CgDice5,
  CgDice6,
} from "react-icons/cg";

export default function generateDie() {
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
