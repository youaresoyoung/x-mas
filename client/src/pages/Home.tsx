import backgroundSnow1 from "../assets/svgs/background_snow_1.svg";
import backgroundSnow2 from "../assets/svgs/background_snow_2.svg";
import backgroundSnow3 from "../assets/svgs/background_snow_3.svg";
import treeMd from "../assets/svgs/tree_md.svg";
import treeSm from "../assets/svgs/tree_sm.svg";

const BACKGROUND_POSITION = [
  { img: backgroundSnow1, alt: "Background Snow first", zIndex: 30, bottom: 0 },
  {
    img: backgroundSnow2,
    alt: "Background Snow second",
    zIndex: 20,
    bottom: 0,
  },
  { img: backgroundSnow3, alt: "Background Snow third", zIndex: 10, bottom: 0 },
];

const TREES_POSITION = [
  { img: treeSm, alt: "tree small left", zIndex: 30, bottom: 80, left: 140 },
  { img: treeSm, alt: "tree small right", zIndex: 30, bottom: 80, right: 140 },
  { img: treeMd, alt: "tree medium left", zIndex: 30, bottom: 30, left: 20 },
  { img: treeMd, alt: "tree medium right", zIndex: 30, bottom: 30, right: 20 },
];

export default function Home() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {BACKGROUND_POSITION.map((item) => (
        <img
          key={item.alt}
          src={item.img}
          alt={item.alt}
          className={`absolute bottom-${item.bottom} left-0 z-${item.zIndex} w-full`}
        />
      ))}
      {TREES_POSITION.map((item) => (
        <img
          key={item.alt}
          src={item.img}
          alt={item.alt}
          className={`absolute bottom-${item.bottom} ${
            item.left ? `left-${item.left}` : `right-${item.right}`
          } z-${item.zIndex}`}
        />
      ))}
    </div>
  );
}
