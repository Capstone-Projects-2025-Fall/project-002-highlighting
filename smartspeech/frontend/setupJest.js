
    // jest.config.ts
    import type { Config } from '@jest/types';

    const config: Config.InitialOptions = {
      preset: 'ts-jest',
      testEnvironment: 'node',
      collectCoverage: true, // Enable code coverage collection
      coverageDirectory: 'coverage', // Specify the output directory for coverage reports
      coverageReporters: ['html', 'text'], // Output HTML and text reports
    };

    export default config;