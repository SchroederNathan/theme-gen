const people = [
    { id: 1, name: 'Definitely Not Coral', selected: true },
    { id: 2, name: "Salmon's Shy Cousin", selected: true },
    { id: 3, name: 'Corporate Gray', selected: false },
    { id: 4, name: 'That One Blue', selected: false },
    { id: 5, name: 'Accent McAccentface', selected: false },
  ]
  
  export default function Checklist() {
    return (
      <fieldset>
        <legend data-color="text" className="text-base font-semibold text-text px-4">Color suspects</legend>
        <div data-color="border" className="mt-4 divide-y divide-border border-t border-b border-border">
          {people.map((person, personIdx) => (
            <div key={personIdx} className="relative flex gap-3 py-4">
              <div className="min-w-0 flex-1 text-sm/6">
                <label htmlFor={`person-${person.id}`} data-color="text" className="font-medium px-4 text-text select-none">
                  {person.name}
                </label>
              </div>
              <div className="flex h-6 shrink-0 items-center px-4">
                <div className="group grid size-4 grid-cols-1">
                  <input
                    defaultChecked={person.selected}
                    id={`person-${person.id}`}
                    name={`person-${person.id}`}
                    type="checkbox"
                    data-color="secondary"
                    className="col-start-1 row-start-1 appearance-none rounded-sm border border-border bg-secondary checked:border-primary checked:bg-primary indeterminate:border-primary indeterminate:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:border-border disabled:bg-background disabled:checked:bg-background forced-colors:appearance-auto"
                  />
                  <svg
                    fill="none"
                    viewBox="0 0 14 14"
                    className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-background group-has-disabled:stroke-text/25"
                  >
                    <path
                      d="M3 8L6 11L11 3.5"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-0 group-has-checked:opacity-100"
                    />
                    <path
                      d="M3 7H11"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-0 group-has-indeterminate:opacity-100"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </fieldset>
    )
  }
  