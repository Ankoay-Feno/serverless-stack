import { useEffect, useRef, useState } from 'react'
import './App.css'

function RouteLink({ to, currentPath, onNavigate, children }) {
  const isActive = currentPath === to

  const handleClick = (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    onNavigate(to)
  }

  return (
    <a
      href={to}
      onClick={handleClick}
      className={`route-link${isActive ? ' active' : ''}`}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </a>
  )
}

function LandingPage({ onNavigate }) {
  return (
    <section className="page panel landing-page">
      <h1>Welcome</h1>
      <p className="subtle">Choose a tool:</p>
      <div className="card-grid">
        <button type="button" className="action-card" onClick={() => onNavigate('/calculator')}>
          <h2>Calculator</h2>
          <p>Basic operations with a simple interface.</p>
        </button>
        <button type="button" className="action-card" onClick={() => onNavigate('/3dcube')}>
          <h2>3D Cube</h2>
          <p>Observe and rotate an interactive cube.</p>
        </button>
        <button type="button" className="action-card" onClick={() => onNavigate('/snake')}>
          <h2>Snake</h2>
          <p>Classic snake game with keyboard controls.</p>
        </button>
      </div>
    </section>
  )
}

function CalculatorPage() {
  const [display, setDisplay] = useState('0')
  const [firstValue, setFirstValue] = useState(null)
  const [operator, setOperator] = useState(null)
  const [waitingForSecondValue, setWaitingForSecondValue] = useState(false)

  const inputDigit = (digit) => {
    if (display === 'Error') {
      setDisplay(digit)
      setWaitingForSecondValue(false)
      return
    }

    if (waitingForSecondValue) {
      setDisplay(digit)
      setWaitingForSecondValue(false)
      return
    }

    setDisplay((current) => (current === '0' ? digit : current + digit))
  }

  const inputDecimal = () => {
    if (display === 'Error') {
      setDisplay('0.')
      setWaitingForSecondValue(false)
      return
    }

    if (waitingForSecondValue) {
      setDisplay('0.')
      setWaitingForSecondValue(false)
      return
    }

    if (!display.includes('.')) {
      setDisplay((current) => current + '.')
    }
  }

  const clearAll = () => {
    setDisplay('0')
    setFirstValue(null)
    setOperator(null)
    setWaitingForSecondValue(false)
  }

  const deleteLast = () => {
    if (display === 'Error' || waitingForSecondValue) return
    setDisplay((current) => (current.length <= 1 ? '0' : current.slice(0, -1)))
  }

  const calculate = (left, right, op) => {
    switch (op) {
      case '+':
        return left + right
      case '-':
        return left - right
      case 'x':
        return left * right
      case '/':
        return right === 0 ? null : left / right
      default:
        return right
    }
  }

  const handleOperator = (nextOperator) => {
    if (display === 'Error') return

    const inputValue = Number(display)

    if (firstValue === null) {
      setFirstValue(inputValue)
    } else if (operator && !waitingForSecondValue) {
      const result = calculate(firstValue, inputValue, operator)
      if (result === null) {
        setDisplay('Error')
        setFirstValue(null)
        setOperator(null)
        setWaitingForSecondValue(false)
        return
      }

      const formatted = String(parseFloat(result.toFixed(10)))
      setDisplay(formatted)
      setFirstValue(Number(formatted))
    }

    setOperator(nextOperator)
    setWaitingForSecondValue(true)
  }

  const handleEquals = () => {
    if (display === 'Error' || operator === null || waitingForSecondValue) return

    const result = calculate(firstValue, Number(display), operator)
    if (result === null) {
      setDisplay('Error')
      setFirstValue(null)
      setOperator(null)
      setWaitingForSecondValue(false)
      return
    }

    const formatted = String(parseFloat(result.toFixed(10)))
    setDisplay(formatted)
    setFirstValue(null)
    setOperator(null)
    setWaitingForSecondValue(false)
  }

  const toggleSign = () => {
    if (display === '0' || display === 'Error') return
    setDisplay((current) => (current.startsWith('-') ? current.slice(1) : `-${current}`))
  }

  const CalcButton = ({ label, onClick, className = '' }) => (
    <button type="button" className={`calc-btn ${className}`.trim()} onClick={onClick}>
      {label}
    </button>
  )

  return (
    <section className="page panel">
      <h1>Calculator</h1>
      <div className="calculator">
        <div className="calc-screen">{display}</div>
        <div className="calc-grid">
          <CalcButton label="C" onClick={clearAll} className="control" />
          <CalcButton label="DEL" onClick={deleteLast} className="control" />
          <CalcButton label="+/-" onClick={toggleSign} className="control" />
          <CalcButton label="/" onClick={() => handleOperator('/')} className="operator" />

          <CalcButton label="7" onClick={() => inputDigit('7')} />
          <CalcButton label="8" onClick={() => inputDigit('8')} />
          <CalcButton label="9" onClick={() => inputDigit('9')} />
          <CalcButton label="x" onClick={() => handleOperator('x')} className="operator" />

          <CalcButton label="4" onClick={() => inputDigit('4')} />
          <CalcButton label="5" onClick={() => inputDigit('5')} />
          <CalcButton label="6" onClick={() => inputDigit('6')} />
          <CalcButton label="-" onClick={() => handleOperator('-')} className="operator" />

          <CalcButton label="1" onClick={() => inputDigit('1')} />
          <CalcButton label="2" onClick={() => inputDigit('2')} />
          <CalcButton label="3" onClick={() => inputDigit('3')} />
          <CalcButton label="+" onClick={() => handleOperator('+')} className="operator" />

          <CalcButton label="0" onClick={() => inputDigit('0')} className="zero" />
          <CalcButton label="." onClick={inputDecimal} />
          <CalcButton label="=" onClick={handleEquals} className="equal" />
        </div>
      </div>
    </section>
  )
}

function CubePage() {
  const [rotationX, setRotationX] = useState(-24)
  const [rotationY, setRotationY] = useState(32)
  const [zoom, setZoom] = useState(1)
  const dragRef = useRef({ dragging: false, lastX: 0, lastY: 0 })

  const handlePointerDown = (event) => {
    dragRef.current.dragging = true
    dragRef.current.lastX = event.clientX
    dragRef.current.lastY = event.clientY
  }

  const handlePointerMove = (event) => {
    if (!dragRef.current.dragging) return
    const dx = event.clientX - dragRef.current.lastX
    const dy = event.clientY - dragRef.current.lastY
    dragRef.current.lastX = event.clientX
    dragRef.current.lastY = event.clientY
    setRotationY((current) => current + dx * 0.5)
    setRotationX((current) => current - dy * 0.5)
  }

  const handlePointerUp = () => {
    dragRef.current.dragging = false
  }

  const resetView = () => {
    setRotationX(-24)
    setRotationY(32)
    setZoom(1)
  }

  return (
    <section className="page panel">
      <h1>3D Cube</h1>
      <p className="subtle">Drag with the mouse to rotate the cube.</p>

      <div
        className="viewport"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div
          className="scene"
          style={{ transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg) scale(${zoom})` }}
        >
          <div className="face front">Front</div>
          <div className="face back">Back</div>
          <div className="face right">Right</div>
          <div className="face left">Left</div>
          <div className="face top">Top</div>
          <div className="face bottom">Bottom</div>
        </div>
      </div>

      <div className="controls">
        <label htmlFor="rx">Rotation X</label>
        <input
          id="rx"
          type="range"
          min="-180"
          max="180"
          value={rotationX}
          onChange={(event) => setRotationX(Number(event.target.value))}
        />

        <label htmlFor="ry">Rotation Y</label>
        <input
          id="ry"
          type="range"
          min="-180"
          max="180"
          value={rotationY}
          onChange={(event) => setRotationY(Number(event.target.value))}
        />

        <label htmlFor="zoom">Zoom</label>
        <input
          id="zoom"
          type="range"
          min="0.6"
          max="1.8"
          step="0.01"
          value={zoom}
          onChange={(event) => setZoom(Number(event.target.value))}
        />

        <button type="button" onClick={resetView}>
          Reset
        </button>
      </div>
    </section>
  )
}

function SnakePage() {
  const size = 16
  const startSnake = [
    { x: 8, y: 8 },
    { x: 7, y: 8 },
    { x: 6, y: 8 },
  ]

  const randomFood = (snake) => {
    let food = { x: 0, y: 0 }
    do {
      food = {
        x: Math.floor(Math.random() * size),
        y: Math.floor(Math.random() * size),
      }
    } while (snake.some((part) => part.x === food.x && part.y === food.y))
    return food
  }

  const [snake, setSnake] = useState(startSnake)
  const [food, setFood] = useState(() => randomFood(startSnake))
  const [direction, setDirection] = useState({ x: 1, y: 0 })
  const [isRunning, setIsRunning] = useState(true)
  const [isGameOver, setIsGameOver] = useState(false)
  const nextDirectionRef = useRef({ x: 1, y: 0 })

  const resetGame = () => {
    setSnake(startSnake)
    setFood(randomFood(startSnake))
    setDirection({ x: 1, y: 0 })
    nextDirectionRef.current = { x: 1, y: 0 }
    setIsRunning(true)
    setIsGameOver(false)
  }

  useEffect(() => {
    const onKeyDown = (event) => {
      const keyMap = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
      }

      const next = keyMap[event.key]
      if (!next) return
      event.preventDefault()

      const current = nextDirectionRef.current
      if (next.x === -current.x && next.y === -current.y) return
      nextDirectionRef.current = next
      if (isGameOver) {
        setIsRunning(true)
        setIsGameOver(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isGameOver])

  useEffect(() => {
    if (!isRunning || isGameOver) return undefined

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const nextDir = nextDirectionRef.current
        setDirection(nextDir)

        const head = prevSnake[0]
        const newHead = {
          x: head.x + nextDir.x,
          y: head.y + nextDir.y,
        }

        const outOfBounds =
          newHead.x < 0 || newHead.x >= size || newHead.y < 0 || newHead.y >= size
        const hitsSelf = prevSnake.some((part) => part.x === newHead.x && part.y === newHead.y)

        if (outOfBounds || hitsSelf) {
          setIsGameOver(true)
          setIsRunning(false)
          return prevSnake
        }

        const nextSnake = [newHead, ...prevSnake]
        const ateFood = newHead.x === food.x && newHead.y === food.y

        if (ateFood) {
          setFood(randomFood(nextSnake))
          return nextSnake
        }

        nextSnake.pop()
        return nextSnake
      })
    }, 130)

    return () => clearInterval(interval)
  }, [food, isGameOver, isRunning])

  const score = snake.length - startSnake.length
  const dirLabel =
    direction.x === 1 ? 'Right' : direction.x === -1 ? 'Left' : direction.y === 1 ? 'Down' : 'Up'

  return (
    <section className="page panel snake-page">
      <h1>Snake</h1>
      <div className="snake-info">
        <p className="snake-text">Score: {score}</p>
        <p className="snake-text">Direction: {dirLabel}</p>
        <button type="button" className="snake-btn" onClick={resetGame}>
          New game
        </button>
      </div>

      {isGameOver && <p className="snake-over">Game over. Press arrows or New game.</p>}

      <div className="snake-board">
        {Array.from({ length: size * size }, (_, i) => {
          const x = i % size
          const y = Math.floor(i / size)
          const isFood = food.x === x && food.y === y
          const bodyIndex = snake.findIndex((part) => part.x === x && part.y === y)
          const isHead = bodyIndex === 0
          const isBody = bodyIndex > 0

          return (
            <div
              key={`${x}-${y}`}
              className={`snake-cell ${isHead ? 'head' : ''} ${isBody ? 'body' : ''} ${isFood ? 'food' : ''}`.trim()}
            />
          )
        })}
      </div>
      <p className="subtle">Use arrow keys to play.</p>
    </section>
  )
}

function NotFoundPage({ onNavigate }) {
  return (
    <section className="page panel not-found-panel">
      <h1>404</h1>
      <p className="subtle">Page not found.</p>
      <button type="button" className="home-link" onClick={() => onNavigate('/')}>
        Back to home
      </button>
    </section>
  )
}

function App() {
  const [path, setPath] = useState(window.location.pathname || '/')

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname || '/')
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigate = (to) => {
    if (to === path) return
    window.history.pushState({}, '', to)
    setPath(to)
  }

  let page = null
  if (path === '/') page = <LandingPage onNavigate={navigate} />
  else if (path === '/calculator') page = <CalculatorPage />
  else if (path === '/3dcube') page = <CubePage />
  else if (path === '/snake') page = <SnakePage />
  else page = <NotFoundPage onNavigate={navigate} />

  return (
    <main className="app-wrap">
      <header className="top-nav panel">
        <RouteLink to="/" currentPath={path} onNavigate={navigate}>
          Home
        </RouteLink>
        <RouteLink to="/calculator" currentPath={path} onNavigate={navigate}>
          Calculator
        </RouteLink>
        <RouteLink to="/3dcube" currentPath={path} onNavigate={navigate}>
          3D Cube
        </RouteLink>
        <RouteLink to="/snake" currentPath={path} onNavigate={navigate}>
          Snake
        </RouteLink>
      </header>

      {page}
    </main>
  )
}

export default App
