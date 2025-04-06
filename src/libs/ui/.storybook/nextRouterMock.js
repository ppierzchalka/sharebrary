/* eslint-disable @typescript-eslint/no-empty-function */

// Mock Next.js router for Storybook
export function useRouter() {
  return {
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    push: () => Promise.resolve(true),
    replace: () => Promise.resolve(true),
    reload: () => {},
    back: () => {},
    prefetch: () => Promise.resolve(),
    beforePopState: () => {},
    events: {
      on: () => {},
      off: () => {},
      emit: () => {},
    },
    isFallback: false,
  };
}

export default mockRouter = {
  useRouter,
};
