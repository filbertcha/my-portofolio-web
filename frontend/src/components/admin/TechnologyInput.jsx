import { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn.js';

export function TechnologyInput({ value, onChange, suggestions = [], error }) {
  const [input, setInput] = useState('');

  const add = (raw) => {
    const parts = String(raw)
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean);

    if (parts.length === 0) return;

    const next = [...value];
    for (const part of parts) {
      if (!next.some((item) => item.toLowerCase() === part.toLowerCase())) {
        next.push(part);
      }
    }
    onChange(next);
  };

  const remove = (technology) => {
    onChange(value.filter((item) => item !== technology));
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      add(input);
      setInput('');
    } else if (event.key === 'Backspace' && !input && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const filteredSuggestions = suggestions
    .map((technology) => technology.name)
    .filter(
      (name, index, list) =>
        list.indexOf(name) === index &&
        !value.some((item) => item.toLowerCase() === name.toLowerCase()) &&
        (!input || name.toLowerCase().includes(input.toLowerCase())),
    )
    .slice(0, 6);

  return (
    <div>
      <div
        className={cn(
          'flex min-h-[46px] w-full flex-wrap items-center gap-1.5 rounded-xl border border-white/10 bg-ink-900/80 px-2.5 py-2 transition-colors focus-within:border-accent-400/60 focus-within:ring-2 focus-within:ring-accent-400/15',
          error && 'border-rose-400/50',
        )}
      >
        {value.map((technology) => (
          <span
            key={technology}
            className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.05] py-1 pl-2 pr-1 font-mono text-[10px] uppercase tracking-wider text-zinc-300"
          >
            {technology}
            <button
              type="button"
              onClick={() => remove(technology)}
              className="rounded p-0.5 text-zinc-600 transition-colors hover:text-rose-300"
              aria-label={`Remove ${technology}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            add(input);
            setInput('');
          }}
          placeholder={value.length === 0 ? 'Add technology…' : ''}
          className="min-w-[8rem] flex-1 border-0 bg-transparent px-1 py-1 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
          aria-label="Add technology"
        />
      </div>

      {filteredSuggestions.length > 0 ? (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-700">
            Suggestions
          </span>
          {filteredSuggestions.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => add(name)}
              className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 text-[10px] text-zinc-500 transition-colors hover:border-accent-400/25 hover:text-accent-300"
            >
              + {name}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
