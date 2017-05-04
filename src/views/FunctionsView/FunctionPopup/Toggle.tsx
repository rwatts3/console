import * as React from 'react'
import * as cn from 'classnames'

interface ToggleProps {
  choices: string[]
  onChange: (choice: string) => void
  activeChoice: string
}

export default function Toggle({choices, onChange, activeChoice}: ToggleProps) {
  return (
    <div className='toggle'>
      <style jsx>{`
        .toggle {
          @p: .flex;
        }
        .choice {
          @p: .f12, .ttu, .br2, .mr6, .fw6, .white40, .pointer;
          letter-spacing: 0.2px;
          padding: 4px 8px;
        }
        .choice.active {
          @p: .darkerBlue;
          background: #b8bfc4;
        }
      `}</style>
      {choices.map(choice => (
        <div
          className={cn('choice', {active: choice === activeChoice})}
          key={choice}
          onClick={() => onChange(choice)}
        >
          {choice}
        </div>
      ))}
    </div>
  )
}
