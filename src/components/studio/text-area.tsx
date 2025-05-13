'use client'

import { useState } from 'react'
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { Frown, HeartIcon, Paperclip, Smile, ThumbsDown, XIcon } from 'lucide-react'
import { Flame } from 'lucide-react'

const moods = [
  { name: 'Excited', value: 'excited', icon: Flame, iconColor: 'text-onPrimary', bgColor: 'bg-error' },
  { name: 'Loved', value: 'loved', icon: HeartIcon, iconColor: 'text-onPrimary', bgColor: 'bg-secondary' },
  { name: 'Happy', value: 'happy', icon: Smile, iconColor: 'text-onPrimary', bgColor: 'bg-success' },
  { name: 'Sad', value: 'sad', icon: Frown, iconColor: 'text-onPrimary', bgColor: 'bg-warning' },
  { name: 'Thumbsy', value: 'thumbsy', icon: ThumbsDown, iconColor: 'text-onPrimary', bgColor: 'bg-primary' },
  { name: 'I feel nothing', value: null, icon: XIcon, iconColor: 'text-muted', bgColor: 'bg-transparent' },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function TextArea() {
  const [selected, setSelected] = useState(moods[5])

  return (
    <div className="flex items-start space-x-4">
      <div className="shrink-0">
        <img
          alt=""
          src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          className="inline-block size-10 rounded-full"
        />
      </div>
      <div className="min-w-0 flex-1">
        <form action="#" className="relative">
          <div className="rounded-lg bg-surface outline-1 -outline-offset-1 outline-border focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-primary">
            <label htmlFor="comment" className="sr-only">
              Add your comment
            </label>
            <textarea
              id="comment"
              name="comment"
              rows={3}
              placeholder="Add your comment..."
              className="block w-full resize-none bg-transparent px-3 py-1.5 text-base text-onSurface placeholder:text-muted focus:outline-none sm:text-sm/6"
              defaultValue={''}
            />

            {/* Spacer element to match the height of the toolbar */}
            <div aria-hidden="true" className="py-2">
              {/* Matches height of button in toolbar (1px border + 36px content height) */}
              <div className="py-px">
                <div className="h-9" />
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pr-2 pl-3">
            <div className="flex items-center space-x-5">
              <div className="flex items-center">
                <button
                  type="button"
                  className="-m-2.5 flex size-10 items-center justify-center rounded-full text-muted hover:text-onSurface"
                >
                  <Paperclip aria-hidden="true" className="size-5" />
                  <span className="sr-only">Attach a file</span>
                </button>
              </div>
              <div className="flex items-center">
                <Listbox value={selected} onChange={setSelected}>
                  <Label className="sr-only">Your mood</Label>
                  <div className="relative">
                    <ListboxButton className="relative -m-2.5 flex size-10 items-center justify-center rounded-full text-muted hover:text-onSurface">
                      <span className="flex items-center justify-center">
                        {selected.value === null ? (
                          <span>
                            <Smile aria-hidden="true" className="size-5 shrink-0" />
                            <span className="sr-only">Add your mood</span>
                          </span>
                        ) : (
                          <span>
                            <span
                              className={classNames(
                                selected.bgColor,
                                'flex size-8 items-center justify-center rounded-full',
                              )}
                            >
                              <selected.icon aria-hidden="true" className="size-5 shrink-0 text-onPrimary" />
                            </span>
                            <span className="sr-only">{selected.name}</span>
                          </span>
                        )}
                      </span>
                    </ListboxButton>

                    <ListboxOptions
                      transition
                      className="absolute z-10 mt-1 -ml-6 w-60 rounded-lg bg-surface py-3 text-base shadow-sm outline-1 outline-border data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:ml-auto sm:w-64 sm:text-sm"
                    >
                      {moods.map((mood) => (
                        <ListboxOption
                          key={mood.value}
                          value={mood}
                          className="cursor-default bg-surface px-3 py-2 select-none data-focus:relative data-focus:bg-background data-focus:outline-hidden"
                        >
                          <div className="flex items-center">
                            <div
                              className={classNames(
                                mood.bgColor,
                                'flex size-8 items-center justify-center rounded-full',
                              )}
                            >
                              <mood.icon aria-hidden="true" className={classNames(mood.iconColor, 'size-5 shrink-0')} />
                            </div>
                            <span className="ml-3 block truncate font-medium">{mood.name}</span>
                          </div>
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </div>
                </Listbox>
              </div>
            </div>
            <div className="shrink-0">
              <button
                type="submit"
                className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-onPrimary shadow-xs hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Post
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
