"use client";
import { useEffect, useState } from "react";

export default function RandomWordPage() {
  const [word, setWord] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userGuess, setUserGuess] = useState<string>("");
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchRandomWord() {
      try {
        const response = await fetch("/api/word");
        if (!response.ok) {
          throw new Error("Failed to fetch the word");
        }
        const data = await response.json();

        if (isMounted) {
          setWord(data.word);
        }
      } catch (error) {
        if (isMounted) {
          setError("Failed to fetch the random word");
        }
      }
    }

    fetchRandomWord();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleGuess = async () => {
    if (!word) return;

    try {
      const response = await fetch(
        `/api/checkWord?baseWord=${encodeURIComponent(
          word
        )}&word=${encodeURIComponent(userGuess)}`
      );
      if (!response.ok) {
        throw new Error("Failed to check the word");
      }
      const data = await response.json();

      setResultMessage(
        data.result ? "Correct! You guessed the word!" : "Incorrect! Try again."
      );
    } catch (error) {
      setError("Failed to check the word");
    }
  };

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="container">
      <h1 className="title">Guess the Word</h1>

      <div className="input-container">
        <input
          type="text"
          placeholder="Enter your guess"
          value={userGuess}
          onChange={(e) => setUserGuess(e.target.value)}
        />
        <button onClick={handleGuess}>Submit Guess</button>
      </div>

      {resultMessage && <p className="result-message">{resultMessage}</p>}
    </div>
  );
}
