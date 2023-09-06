import { useEffect, useRef, useState } from "react"
import { useStore } from "../stores"
import "./Column.css"
import { Task } from "./Task"
import classNames from "classnames"

export function Column({ state }) {
  const [text, setText] = useState("")
  const [open, setOpen] = useState(false)
  const [drop, setDrop] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (inputRef && open) {
      inputRef.current?.focus()
    }
  }, [inputRef.current, open])

  const tasks = useStore((store) =>
    store.tasks.filter((task) => task.state === state)
  )

  const addTask = useStore((store) => store.addTask)
  const setDraggedTask = useStore((store) => store.setDraggedTask)
  const moveTask = useStore((store) => store.moveTask)
  const draggedTask = useStore((store) => store.draggedTask)

  return (
    <div
      className={classNames("column", { drop: drop })}
      onDragOver={(e) => {
        e.preventDefault()
        setDrop(true)
      }}
      onDragLeave={(e) => {
        e.preventDefault()
        setDrop(false)
      }}
      onDrop={() => {
        moveTask(draggedTask, state)
        setDraggedTask(null)
        setDrop(false)
      }}
    >
      <div className="titleWrapper">
        <p>{state}</p>
        <button
          onClick={() => {
            setOpen(true)
          }}
        >
          Add
        </button>
      </div>
      {tasks.map((task, index) => (
        <Task title={task.title} key={task.title + index} />
      ))}

      {open && (
        <div className="Modal">
          <div className="modalContent">
            <input
              type="text"
              onChange={(e) => setText(e.target.value)}
              value={text}
              ref={inputRef}
            />
            <button
              onClick={() => {
                addTask(text, state)
                setText("")
                setOpen(false)
              }}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
