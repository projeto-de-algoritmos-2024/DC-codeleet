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

  useEffect(() => {
    let isMounted = true;

    async function fetchRandomWord() {
      try {
        const response = await fetch("/api/word");
        if (!response.ok) {
          throw new Error("Falha ao buscar a palavra");
        }
        const data = await response.json();

        if (isMounted) {
          const decodedWord = decodeURIComponent(data.word);
          setWord(decodedWord);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setError("Falha ao buscar a palavra aleatória");
          setLoading(false);
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

    setLoading(true);

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
          </div>

          {resultMessage && <p className="result-message">{resultMessage}</p>}

          <h2>Palpites Tentados:</h2>
          <ul className="guesses-list">
            {guesses.map((guess, index) => (
              <li key={index}>
                {guess.word} - Similaridade: {guess.similarity}/10
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
