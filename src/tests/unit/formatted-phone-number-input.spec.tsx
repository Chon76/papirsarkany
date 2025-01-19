import { expect } from '@playwright/test';
import {
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
} from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { afterEach, test } from 'vitest';

import FormattedPhoneNumberInput from '~/components/formatted-phone-number-input';
import { parsePhoneNumber } from '~/lib/formatters';

afterEach(cleanup);

test('should render phone number input value in a formatted way', () => {
  const {
    result: {
      current: { register },
    },
  } = renderHook(() => useForm());
  render(<FormattedPhoneNumberInput {...register('phoneNumber')} />);

  const inputElement = screen.getByRole('textbox') as HTMLInputElement;

  expect(inputElement).toBeDefined();
  expect(inputElement.getAttribute('placeholder')).toBe('+36 20 123 4567');

  fireEvent.input(inputElement, { target: { value: '+36707654321' } });

  expect(inputElement.value).toBe('+36 70 765 4321');
});

test('should regsiter raw phone number (without any formatting)', () => {
  const {
    result: {
      current: { register, getValues },
    },
  } = renderHook(() => useForm());
  render(
    <FormattedPhoneNumberInput
      {...register('phoneNumber', {
        setValueAs: parsePhoneNumber,
      })}
    />,
  );

  const inputElement = screen.getByRole('textbox') as HTMLInputElement;

  fireEvent.input(inputElement, {
    target: { value: '+36707654321' },
  });
  fireEvent.blur(inputElement);

  expect(getValues('phoneNumber')).toBe('+36707654321');
});
