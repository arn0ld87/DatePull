import React from 'react';

interface TextInputProps {
  text: string;
  setText: (text: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({ text, setText }) => {
  return (
    <div>
      <label htmlFor="schedule-text" className="block text-sm font-medium text-brand-text-secondary mb-2">
        Stundenplan als Text einfügen
      </label>
      <div className="mt-1">
        <textarea
          id="schedule-text"
          name="schedule-text"
          rows={10}
          className="shadow-sm focus:ring-brand-primary focus:border-brand-primary block w-full sm:text-sm border-brand-surface-light rounded-xl bg-brand-surface placeholder-brand-text-secondary/50 text-brand-text-primary"
          placeholder="Montag, 10:00 - 12:00, Analysis I, Hörsaal 5C..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <p className="mt-3 text-sm text-brand-text-secondary/80">
        Fügen Sie den Inhalt Ihres Stundenplans hier ein, um ihn analysieren zu lassen.
      </p>
    </div>
  );
};

export default TextInput;