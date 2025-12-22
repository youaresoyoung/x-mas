import backgroundSnow1 from "../assets/svgs/background_snow_1.svg";
import backgroundSnow2 from "../assets/svgs/background_snow_2.svg";
import backgroundSnow3 from "../assets/svgs/background_snow_3.svg";
import treeMd from "../assets/svgs/tree_md.svg";
import treeSm from "../assets/svgs/tree_sm.svg";
import { Star } from "../components/Star";

export const BACKGROUND_POSITION = [
  { img: backgroundSnow1, alt: "Background Snow first", zIndex: "z-30" },
  {
    img: backgroundSnow2,
    alt: "Background Snow second",
    zIndex: "z-20",
  },
  { img: backgroundSnow3, alt: "Background Snow third", zIndex: "z-10" },
];

export const TREES_POSITION = [
  {
    img: treeSm,
    alt: "tree small left",
    position: "z-30 bottom-80 left-140",
    star: (
      <Star
        id="star-sm-left"
        size={80}
        className="absolute left-1/2 -translate-x-1/2 z-99"
        style={{ top: "-40px" }}
      />
    ),
  },
  {
    img: treeSm,
    alt: "tree small right",
    position: "z-30 bottom-80 right-140",
    star: (
      <Star
        id="star-sm-right"
        size={80}
        className="absolute left-1/2 -translate-x-1/2 z-99"
        style={{ top: "-40px" }}
      />
    ),
  },
  {
    img: treeMd,
    alt: "tree medium left",
    position: "z-30 bottom-30 left-20",
    star: (
      <Star
        id="star-md-left"
        size={100}
        className="absolute left-1/2 -translate-x-1/2 z-99"
        style={{ top: "-50px" }}
      />
    ),
  },
  {
    img: treeMd,
    alt: "tree medium right",
    position: "z-30 bottom-30 right-20",
    star: (
      <Star
        id="star-md-right"
        size={100}
        className="absolute left-1/2 -translate-x-1/2 z-99"
        style={{ top: "-50px" }}
      />
    ),
  },
];

export const COLORS = ["red", "blue", "green", "yellow"] as const;

export const TREE_MD_LEFT_BALLS = [
  { top: "35%", left: "30%" },
  { top: "45%", left: "50%" },
  { top: "55%", left: "25%" },
  { top: "50%", left: "65%" },
  { top: "65%", left: "40%" },
  { top: "70%", left: "60%" },
  { top: "75%", left: "20%" },
];

export const TREE_MD_RIGHT_BALLS = [
  { top: "35%", right: "30%" },
  { top: "45%", right: "50%" },
  { top: "55%", right: "25%" },
  { top: "50%", right: "65%" },
  { top: "65%", right: "40%" },
  { top: "70%", right: "60%" },
  { top: "75%", right: "20%" },
];

export const TREE_SM_LEFT_BALLS = [
  { top: "40%", left: "35%" },
  { top: "55%", left: "25%" },
  { top: "55%", left: "55%" },
  { top: "70%", left: "40%" },
];

export const TREE_SM_RIGHT_BALLS = [
  { top: "40%", left: "35%" },
  { top: "55%", left: "25%" },
  { top: "55%", left: "55%" },
  { top: "70%", left: "40%" },
];
