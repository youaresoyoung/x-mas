import { TreePine, Sparkles, Snowflake, Gift, Candy } from "lucide-react";

const DECORATION_ICONS = [
  { icon: TreePine, color: "text-christmas-green" },
  { icon: Sparkles, color: "text-christmas-gold" },
  { icon: Gift, color: "text-christmas-red" },
  { icon: Candy, color: "text-christmas-red" },
  { icon: Snowflake, color: "text-winter-blue" },
  { icon: TreePine, color: "text-christmas-green" },
];

export default function Entrance() {
  return (
    <div className="relative max-w-md w-full mx-auto">
      <div className="relative bg-snow-white p-8 rounded-2xl shadow-2xl border-4 border-christmas-red flex flex-col gap-6">
        <div className="text-center space-y-2">
          <TreePine className="w-16 h-16 mx-auto text-christmas-green" />
          <h1 className="font-bilbo text-6xl text-christmas-red drop-shadow-md">
            Merry Christmas
          </h1>
        </div>

        <div className="h-px bg-linear-to-r from-transparent via-christmas-red to-transparent"></div>

        <div className="text-center space-y-3">
          <h2 className="font-bilbo text-3xl text-christmas-green">
            Dear Visitor
          </h2>
          <p className="text-gray-700 leading-relaxed px-4">
            Welcome to our Christmas Room!
            <br />
            Enter your name and join the festive celebration.
          </p>
        </div>

        <form className="flex flex-col gap-4 mt-2">
          <div className="space-y-2">
            <label
              htmlFor="nickname"
              className="block text-sm font-medium text-christmas-green text-center"
            >
              Your Nickname
            </label>
            <input
              className="w-full px-4 py-3 border-2 border-christmas-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-christmas-red focus:border-transparent transition-all text-center font-bilbo text-xl"
              id="nickname"
              type="text"
              placeholder="Enter your nickname..."
              maxLength={10}
              aria-label="Nickname"
              autoFocus
              required
            />
            <p className="text-xs text-gray-500 text-center">
              Maximum 10 characters
            </p>
          </div>

          <button
            type="button"
            onClick={() => {}}
            className="w-full bg-christmas-green text-white font-bold py-3 px-6 rounded-lg hover:bg-christmas-red transition-all duration-200 text-lg flex items-center justify-center gap-2"
          >
            <TreePine className="w-5 h-5" />
            Enter the Christmas Room
            <TreePine className="w-5 h-5" />
          </button>
        </form>

        <div className="flex justify-center gap-4 pt-2">
          {DECORATION_ICONS.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <IconComponent key={index} className={`w-8 h-8 ${item.color}`} />
            );
          })}
        </div>
      </div>
    </div>
  );
}
