const sonarqubeScanner = require('sonarqube-scanner');

sonarqubeScanner(
    {
        serverUrl: 'https://qube.indexnine.com',
        token: 'd8b5200e9e977f50b11214a447c43eb0ffc0ad1e',
        options: {
            'sonar.projectName': 'Stackidentity UI',
            'sonar.sources': 'src',
            'sonar.tests': 'src',
            'sonar.typescript.lcov.reportPaths': 'coverage/lcov.info',
            'sonar.exclusions': '**/__tests__/*',
            'sonar.test.inclusions': 'src/**/*.spec.tsx,src/**/*.spec.ts',
        },
    },
    () => process.exit(),
);
