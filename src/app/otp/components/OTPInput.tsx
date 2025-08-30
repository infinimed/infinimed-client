import React, { forwardRef, KeyboardEvent } from 'react';
import * as Form from '@radix-ui/react-form';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  index: number;
}

const OTPInput = forwardRef<HTMLInputElement, OTPInputProps>(
  ({ value, onChange, onKeyDown, onPaste, index }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      // Allow empty, single digit, or multiple digits (for iOS SMS AutoFill which inserts the whole code)
      if (newValue === '' || /^\d+$/.test(newValue)) {
        onChange(newValue);
      }
    };

    return (
      <Form.Field name={`otp-${index}`}>
        <Form.Control asChild>
          <input
            className="w-12 h-12 border-2 rounded-lg text-center text-xl font-bold focus:border-blue-500 focus:outline-none"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="\d{1}"
            maxLength={1}
            value={value}
            onChange={handleChange}
            onKeyDown={onKeyDown}
            onPaste={onPaste}
            ref={ref}
          />
        </Form.Control>
      </Form.Field>
    );
  },
);

OTPInput.displayName = 'OTPInput';

export default OTPInput;
