/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: "jsdom",
  moduleNameMapper: {
    '\\.(css|less)$':  "identity-obj-proxy",
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        diagnostics: {
          ignoreCodes: [1343],
        },
        astTransformers: {
          before: [
            {
              path: 'node_modules/ts-jest-mock-import-meta',
              options: {
                metaObjectReplacement: {
                  env: {
                    // Replicate as .env.local
                    VITE_API_PATH: 'http://localhost:3001',
                  },
                },
              },
            },
          ],
        },
      },
    ],
  },
};
