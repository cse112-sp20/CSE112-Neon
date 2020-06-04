# CSE112-Neon
[![Actions Status](https://github.com/cse112-sp20/CSE112-Neon/workflows/unit/badge.svg)](https://github.com/cse112-sp20/CSE112-Neon/actions) [![Actions Status](https://github.com/cse112-sp20/CSE112-Neon/workflows/integration/badge.svg)](https://github.com/cse112-sp20/CSE112-Neon/actions) [![Actions Status](https://github.com/cse112-sp20/CSE112-Neon/workflows/Build/badge.svg)](https://github.com/cse112-sp20/CSE112-Neon/actions)

[![Maintainability](https://api.codeclimate.com/v1/badges/241caa7b9153e0b64ffd/maintainability)](https://codeclimate.com/github/cse112-sp20/CSE112-Neon/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/241caa7b9153e0b64ffd/test_coverage)](https://codeclimate.com/github/cse112-sp20/CSE112-Neon/test_coverage)

## Installing
```bash
npm install
```

## Running 
```bash
npm run start
```

## Lint
  Runs ESlint
```bash
npm run lint
```

## Pushing
Before pushing run this command to ensure that you will not
fail due to silly mistakes. This will run both unit testing
and the linter. (This will be enforced and automated by Husky soon).
```bash
npm run prepush
```

## Testing
Unit Testing
  This is done using Mocha+Chai
  Runs all tests in folder test/unit_testing
  ```bash
  npm run test:unit
  ```

Integration Testing
  This is done using Mocha+Spectron
  Runs all tests in folder test/integration_testing
  ```bash
  npm run test:int
  ```

## Coverage
  Currently we are only checking the coverage of unit testing.
  to run the tests. This will check all js files in folders
  not excluded in package.json under "nyc". 
  
  Nothing is currently being enforced off of these results.
  
  ```bash
  npm run test:unit_cov
  npm run test:unit_cov_html
  ```
  
  unit_cov will show you the resutls in terminal
  unit_cov_html will create a folder called coverage in root with
    a html file listing out the coverages 
  
	
## Building
  To create your own local exe. This will be located
  in a created folder dist which will reside in the
  root dir.
  
  ```bash
  npm run manual:build
  ```


## Release
  This is done through Gitub Actions.
  
    1. Make sure you are working in the release branch.
    2. Merge master into release.
    3. Update the version in your project's package.json file (e.g. 1.2.3).
    4. Commit that change (git commit -am v1.2.3).
    5. Tag your commit (git tag v1.2.3). Make sure your tag name's format is
       v*.*.*. Your workflow will use this tag to detect when to create a release.
    6. Push your changes to GitHub (git push && git push --tags).
    7. Create a pull request to merge changes into master.
    8. Go to the release tab in GHithub. There will now be a Draft of the taged commit
      click edit, make any changes you wish and publish the draft to release to the
      public.
    
  After the build check under the release tab in Github.
