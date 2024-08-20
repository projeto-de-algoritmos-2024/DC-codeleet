"use client";
import { useEffect, useState } from "react";

interface Guess {
  word: string;
  similarity: number;
}

export default function RandomWordPage() {
  const [word, setWord] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userGuess, setUserGuess] = useState<string>("");
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [inputError, setInputError] = useState<string | null>(null);

  useEffect(() => {
    fetchRandomWord();
  }, []);

  async function fetchRandomWord() {
    setLoading(true);
    setResultMessage(null);
    setGuesses([]);
    setUserGuess("");
    setInputError(null);

    try {
      const response = await fetch("/api/word");
      if (!response.ok) {
        throw new Error("Falha ao buscar a palavra");
      }
      const data = await response.json();

      const decodedWord = decodeURIComponent(data.word);
      setWord(decodedWord);
      setLoading(false);
    } catch (error) {
      setError("Falha ao buscar a palavra aleatória");
      setLoading(false);
    }
  }

  const handleGuess = async () => {
    if (!word) return;

    if (userGuess.trim() === "") {
      setInputError(
        "Por favor, escreva uma palavra antes de enviar seu palpite."
      );
      return;
    }

    setLoading(true);
    setInputError(null);

    try {
      const response = await fetch(
        `/api/checkWord?baseWord=${encodeURIComponent(
          word
        )}&word=${encodeURIComponent(userGuess)}`
      );
      if (!response.ok) {
        throw new Error("Falha ao verificar a palavra");
      }
      const data = await response.json();

      const similarityScore = data.similarity * 10;

      if (data.result) {
        setResultMessage("Correto! Você acertou a palavra!");
      } else {
        const guess: Guess = {
          word: userGuess,
          similarity: Math.round(similarityScore),
        };

        setGuesses((prevGuesses) => [...prevGuesses, guess]);
        setResultMessage("Incorreto! Tente novamente.");
      }
    } catch (error) {
      setError("Falha ao verificar a palavra");
    } finally {
      setLoading(false);
    }
  };

  const handleGiveUp = () => {
    setResultMessage(`Você desistiu! A palavra era: ${word}`);
    setGuesses([]);
  };

  const handleNewWord = () => {
    fetchRandomWord();
  };

  function getColorBasedOnSimilarity(similarity: number): string {
    const green = Math.round((similarity / 10) * 255);
    const red = 255 - green;
    return `rgb(${red}, ${green}, 0)`;
  }

  if (error) {
    return <div className="error">Erro: {error}</div>;
  }

  return (
    <div className="container">
      <h1 className="title">Adivinhe a Palavra</h1>

      {loading && <p className="loading-message">Carregando...</p>}

      {!loading && (
        <>
          <div className="input-container">
            <input
              type="text"
              placeholder="Digite seu palpite"
              value={userGuess}
              onChange={(e) => setUserGuess(e.target.value)}
              disabled={loading}
            />
            <button onClick={handleGuess} disabled={loading}>
              {loading ? "Verificando..." : "Enviar Palpite"}
            </button>
            <button onClick={handleGiveUp} disabled={loading}>
              Desistir
            </button>
            <button onClick={handleNewWord} disabled={loading}>
              Nova Palavra
            </button>
          </div>

          {inputError && <p className="input-error">{inputError}</p>}
          {resultMessage && <p className="result-message">{resultMessage}</p>}

          <h2>Palpites Tentados:</h2>
          <ul className="guesses-list">
            {guesses.map((guess, index) => (
              <li
                key={index}
                className="guess-item"
                style={{
                  backgroundColor: getColorBasedOnSimilarity(guess.similarity),
                }}
              >
                {guess.word} - Similaridade: {guess.similarity}/10
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
