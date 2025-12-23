import backgroundSnow1 from "../assets/svgs/background_snow_1.svg";
import backgroundSnow2 from "../assets/svgs/background_snow_2.svg";
import backgroundSnow3 from "../assets/svgs/background_snow_3.svg";
import treeMd from "../assets/svgs/tree_md.svg";
import treeSm from "../assets/svgs/tree_sm.svg";
import { Ball } from "../components/Ball";
import { Star } from "../components/Star";

const COLORS = ["red", "blue", "green", "yellow"] as const;

const TREE_MD_LEFT_BALLS = [
  { top: "44%", left: "31%" },
  { top: "48%", left: "57%" },
  { top: "52%", left: "36%" },
  { top: "56%", left: "68%" },
  { top: "61%", left: "51%" },
  { top: "68%", left: "30%" },
  { top: "69%", left: "64%" },
  { top: "73%", left: "43%" },
  { top: "76%", left: "55%" },
  { top: "82%", left: "78%" },
  { top: "82%", left: "37%" },
  { top: "82%", left: "12%" },
];

const TREE_MD_RIGHT_BALLS = [
  { top: "44%", right: "31%" },
  { top: "48%", right: "57%" },
  { top: "52%", right: "36%" },
  { top: "56%", right: "68%" },
  { top: "61%", right: "51%" },
  { top: "68%", right: "30%" },
  { top: "69%", right: "64%" },
  { top: "73%", right: "43%" },
  { top: "76%", right: "55%" },
  { top: "82%", right: "78%" },
  { top: "82%", right: "37%" },
  { top: "82%", right: "12%" },
];

const TREE_SM_LEFT_BALLS = [
  { top: "42%", left: "50%" },
  { top: "46%", left: "34%" },
  { top: "46%", left: "66%" },
  { top: "56%", left: "29%" },
  { top: "58%", left: "73%" },
  { top: "73%", left: "50%" },
  { top: "81%", left: "28%" },
  { top: "80%", left: "72%" },
];

const TREE_SM_RIGHT_BALLS = [
  { top: "45%", left: "35%" },
  { top: "48%", left: "58%" },
  { top: "52%", left: "23%" },
  { top: "55%", left: "67%" },
  { top: "60%", left: "46%" },
  { top: "70%", left: "27%" },
  { top: "73%", left: "76%" },
  { top: "78%", left: "48%" },
];

export const BACKGROUND_POSITION = [
  { img: backgroundSnow1, alt: "Background Snow first", zIndex: "z-30" },
  {
    img: backgroundSnow2,
    alt: "Background Snow second",
    zIndex: "z-20",
  },
  { img: backgroundSnow3, alt: "Background Snow third", zIndex: "z-10" },
];

const totalBalls =
  TREE_MD_LEFT_BALLS.length +
  TREE_MD_RIGHT_BALLS.length +
  TREE_SM_LEFT_BALLS.length +
  TREE_SM_RIGHT_BALLS.length;

const ballColors = Array.from(
  { length: totalBalls },
  () => COLORS[Math.floor(Math.random() * COLORS.length)]
);

let colorIndex = 0;
const getNextColor = () => ballColors[colorIndex++];

const SMALL_BALL_SIZE = 24;
const MEDIUM_BALL_SIZE = 36;
const SMALL_STAR_SIZE = 80;
const MEDIUM_STAR_SIZE = 100;

export const TREES_POSITION = [
  {
    img: treeSm,
    alt: "tree small left",
    position: "z-30 bottom-80 left-140",
    star: (
      <Star
        id="star-sm-left"
        size={SMALL_STAR_SIZE}
        className="absolute left-1/2 -translate-x-1/2 z-99"
        style={{ top: "-40px" }}
      />
    ),
    balls: TREE_SM_LEFT_BALLS.map((position, i) => (
      <Ball
        key={`sm-left-${i}`}
        id={`ball-sm-left-${i}`}
        color={getNextColor()}
        size={SMALL_BALL_SIZE}
        className="absolute"
        style={position}
      />
    )),
  },
  {
    img: treeSm,
    alt: "tree small right",
    position: "z-30 bottom-80 right-140",
    star: (
      <Star
        id="star-sm-right"
        size={SMALL_STAR_SIZE}
        className="absolute left-1/2 -translate-x-1/2 z-99"
        style={{ top: "-40px" }}
      />
    ),
    balls: TREE_SM_RIGHT_BALLS.map((position, i) => (
      <Ball
        key={`sm-right-${i}`}
        id={`ball-sm-right-${i}`}
        color={getNextColor()}
        size={SMALL_BALL_SIZE}
        className="absolute"
        style={position}
      />
    )),
  },
  {
    img: treeMd,
    alt: "tree medium left",
    position: "z-30 bottom-30 left-20",
    star: (
      <Star
        id="star-md-left"
        size={MEDIUM_STAR_SIZE}
        className="absolute left-1/2 -translate-x-1/2 z-99"
        style={{ top: "-50px" }}
      />
    ),
    balls: TREE_MD_LEFT_BALLS.map((position, i) => (
      <Ball
        key={`md-left-${i}`}
        id={`ball-md-left-${i}`}
        color={getNextColor()}
        size={MEDIUM_BALL_SIZE}
        className="absolute"
        style={position}
      />
    )),
  },
  {
    img: treeMd,
    alt: "tree medium right",
    position: "z-30 bottom-30 right-20",
    star: (
      <Star
        id="star-md-right"
        size={MEDIUM_STAR_SIZE}
        className="absolute left-1/2 -translate-x-1/2 z-99"
        style={{ top: "-50px" }}
      />
    ),
    balls: TREE_MD_RIGHT_BALLS.map((position, i) => (
      <Ball
        key={`md-right-${i}`}
        id={`ball-md-right-${i}`}
        color={getNextColor()}
        size={MEDIUM_BALL_SIZE}
        className="absolute"
        style={position}
      />
    )),
  },
];
