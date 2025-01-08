import { mockMediaQueryList } from 'use-media/lib/useMedia';
import { vi } from 'vitest';

type MockMatchMedia = {
  media: string;
  matches?: boolean;
}

function getMockImplementation({ media, matches = false }: MockMatchMedia) {
  const mql: MediaQueryList = {
    ...mockMediaQueryList,
    media,
    matches,
  };

  return () => mql;
}

export function viMockMatchMedia({ media, matches = false }: MockMatchMedia) {
  const mockedImplementation = getMockImplementation({ media, matches });
  window.matchMedia = vi.fn().mockImplementation(mockedImplementation);
}
