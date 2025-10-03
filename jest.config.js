module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@utils-types$': '<rootDir>/src/utils/types.ts',
    '^@api$': '<rootDir>/src/utils/burger-api.ts',
    '^@ui$': '<rootDir>/src/components/ui/index.ts',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(css|scss)$': 'jest-css-modules-transform'
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(ts|tsx)',
    '<rootDir>/src/**/*.(test|spec).(ts|tsx)'
  ],

  // Отчёт о покрытии
  collectCoverage: true,
  collectCoverageFrom: [
    // Фокус: бизнес-логика, которую вы реально тестируете
    'src/services/store.ts',
    'src/services/slices/*Slice.ts',
    'src/utils/burger-api.ts',
    'src/utils/cookie.ts',

    // Исключения
    '!src/**/*.d.ts',
    '!src/**/index.{ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/*.test.{ts,tsx}'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],

  // Пороги под текущий отчёт (их можно повышать позже)
  coverageThreshold: {
    global: { branches: 13, functions: 20, lines: 40, statements: 45 }
  }
};
