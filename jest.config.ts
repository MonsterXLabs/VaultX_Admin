export default {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",           // Map "@/..." to "src/..."
  },
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",    // Match files in __tests__ directory
    "**/tests/**/?(*.)+(test).[jt]s?(x)",     // Match files ending in .test.js/.test.tsx
    "**/?(*.)+(spec).[jt]s?(x)",     // Match files ending in .spec.js/.spec.tsx
  ],
};