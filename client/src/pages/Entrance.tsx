import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router";
import { TreePine, Sparkles, Snowflake, Gift, Candy } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const DECORATION_ICONS = [
  { icon: TreePine, color: "text-christmas-green" },
  { icon: Sparkles, color: "text-christmas-gold" },
  { icon: Gift, color: "text-christmas-red" },
  { icon: Candy, color: "text-christmas-red" },
  { icon: Snowflake, color: "text-winter-blue" },
  { icon: TreePine, color: "text-christmas-green" },
];

const validateNickname = (value: string): string | null => {
  const trimmed = value.trim();

  if (trimmed.length < 2) {
    return "Nickname must be at least 2 characters";
  }

  if (trimmed.length > 10) {
    return "Nickname must be at most 10 characters";
  }

  return null;
};

export default function Entrance() {
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsSubmitting] = useState(false);

  const { setNickname: saveNickname } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const validationError = validateNickname(nickname);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:3000/api/entrance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nickname: nickname.trim() }),
      });

      const data = await response.json();

      if (!data.available) {
        throw new Error(data.error || "Failed to enter the Christmas Room.");
      }

      saveNickname(nickname.trim());
      navigate("/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
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
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setError("");
              }}
              aria-label="Nickname"
              autoFocus
              required
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 text-center">
              2-10 characters (letters, numbers, spaces)
            </p>
            {error && (
              <p className="text-sm text-christmas-red text-center font-medium">
                {error}
              </p>
            )}
          </div>

          <button
            disabled={isLoading || !nickname.trim()}
            className="w-full bg-christmas-green text-white font-bold py-3 px-6 rounded-lg hover:bg-christmas-red transition-all duration-200 text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <TreePine className="w-5 h-5" />
            {isLoading ? "Connecting..." : "Enter the Christmas Room"}
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
