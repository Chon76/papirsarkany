'use client';

import { FC, useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

import { formatPhoneNumber, getRawPhoneNumber } from '~/lib/formatters';

type PhoneNumberInputProps = UseFormRegisterReturn;

const FormattedPhoneNumberInput: FC<PhoneNumberInputProps> = ({
  ...register
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawPhoneNumber = getRawPhoneNumber(e.target.value);
    if (rawPhoneNumber.length > 12) {
      return;
    }
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);

    register.onChange(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    register.onBlur(e);
  };

  return (
    <input
      type="text"
      autoComplete="tel"
      className="d-input d-input-bordered"
      placeholder="+36 20 123 4567"
      value={phoneNumber}
      {...register}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
};

export default FormattedPhoneNumberInput;
