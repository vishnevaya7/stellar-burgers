import '@testing-library/jest-dom';

global.fetch = jest.fn();

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock as any;

delete (window as any).location;
(window as any).location = {
  ...window.location,
  assign: jest.fn(),
  reload: jest.fn(),
  replace: jest.fn()
};

afterEach(() => {
  jest.clearAllMocks();
});
