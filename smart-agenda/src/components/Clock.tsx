import { useEffect, useState } from "react"

export function Clock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  })

  return (
    <div>
      { time.toLocaleString("pt-BR")}
    </div>
  );
}
