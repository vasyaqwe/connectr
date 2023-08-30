import { useEffect, useRef, useState } from "react"
import chevron from "@/assets/chevron.svg"

export type SelectOption = string

type MultipleSelectProps = {
    multiple: true
    currOption: SelectOption[]
    onChange: (currOption: SelectOption[]) => void
}

type SingleSelectProps = {
    multiple?: false
    currOption?: SelectOption
    onChange: (currOption: SelectOption) => void
}

type SelectProps = {
    options: SelectOption[]
} & (SingleSelectProps | MultipleSelectProps)

export const Select = ({
    multiple,
    currOption,
    onChange,
    options,
}: SelectProps) => {
    const [open, setOpen] = useState(false)
    const [highlightedIdx, setHighlightedIdx] = useState(0)

    const ref = useRef<HTMLDivElement>(null)

    const onSelect = (option: SelectOption) => {
        if (multiple) {
            if (currOption?.includes(option)) {
                onChange(currOption.filter((o) => o !== option))
            } else {
                onChange([...currOption, option])
            }
        } else {
            if (option !== currOption) onChange(option)
        }
    }

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.target != ref.current) return
            switch (e.code) {
                case "Enter":
                case "Space":
                    setOpen((prev) => !prev)
                    if (open) onSelect(options[highlightedIdx]!)
                    break
                case "ArrowUp":
                case "ArrowDown": {
                    if (!open) {
                        setOpen(true)
                        break
                    }
                    const newValue =
                        highlightedIdx + (e.code === "ArrowDown" ? 1 : -1)
                    if (newValue >= 0 && newValue < options.length) {
                        e.preventDefault()
                        setHighlightedIdx(newValue)
                    }
                    break
                }
                case "Escape":
                    setOpen(false)
                    break
            }
        }

        ref.current?.addEventListener("keydown", handler)

        return () => ref.current?.removeEventListener("keydown", handler)
    }, [open, highlightedIdx, options])

    const optionSelected = (option: SelectOption) =>
        multiple ? currOption?.includes(option) : option === currOption

    return (
        <div
            tabIndex={0}
            className="border-primary-600 bg-primary-800 relative flex w-full cursor-pointer items-center justify-between rounded-md border px-3 py-2 text-white focus:border-accent-400 focus:outline-none"
            aria-expanded={open}
            ref={ref}
            onClick={() => setOpen((prev) => !prev)}
            onBlur={() => setOpen(false)}
        >
            <span className="select-curr-option">
                {multiple
                    ? currOption?.map((o, idx) => (
                          <button
                              key={idx}
                              onClick={(e) => {
                                  e.stopPropagation()
                                  onSelect(o)
                              }}
                          >
                              {o} <span>&times;</span>
                          </button>
                      ))
                    : currOption}
            </span>
            <img
                src={chevron}
                alt="chevron"
                className={`${open ? "rotate-90" : "-rotate-90"}`}
            />
            <ul
                className={`border-primary-600 bg-primary-800 absolute left-0 top-[110%] z-10 w-full rounded-md border ${
                    open ? "block" : "hidden"
                } `}
            >
                {options.map((option, idx) => (
                    <li
                        key={idx}
                        onClick={() => onSelect(option)}
                        onMouseEnter={() => setHighlightedIdx(idx)}
                        className={`cursor-pointer p-2 hover:bg-accent-400 ${
                            optionSelected(option) ? "bg-accent-700" : ""
                        }
                        ${idx === highlightedIdx ? "bg-accent-400 " : ""}
                        `}
                    >
                        {option}
                    </li>
                ))}
            </ul>
        </div>
    )
}
