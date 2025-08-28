import { type JSX, useEffect, useState, useRef } from "react";

const API_URL = "https://api-contador.onrender.com";

export default function Counter(): JSX.Element {
  const [count, setCount] = useState<number | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  const clickBuffer = useRef(0);
  const timeoutRef = useRef<number | null>(null);

  async function fetchCount(): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/`);
      const data = await response.json();
      setCount(data.value);
      setStatus("ready");
    } catch (error) {
      setStatus("error");
    }
  }

  useEffect((): void => {
    fetchCount();
  }, []);

  function handleClick(): void {
    if (status !== "ready" || count === null) return;

    clickBuffer.current += 1;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async (): Promise<void> => {
      try {
        await fetch(`${API_URL}/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ value: clickBuffer.current }),
        });

        clickBuffer.current = 0;
        fetchCount();
      } catch (error) {
        setStatus("error");
      }
    }, 1000);
  };

  return (
    <div onClick={handleClick} style={{ minHeight: "100vh", minWidth: "100vw", display: "flex", justifyContent: "center", alignItems: "center", userSelect: "none", fontSize: "8rem" }}>
      {status === "loading" && "loading"}
      {status === "error" && "error"}
      {status === "ready" && count}
    </div>
  );
}
