# CSE112-Neon

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
  This is done through Gitub Actions. To do so ensure
  that you are making a Pull Request from branch dev
  into master. On top of that you will need to make
  sure that you follow the following steps.
  
    1. Update the version in your project's package.json file (e.g. 1.2.3)
    2. Commit that change (git commit -am v1.2.3)
    3. Tag your commit (git tag v1.2.3). Make sure your tag name's format is
    v*.*.*. Your workflow will use this tag to detect when to create a release.
    4. Push your changes to GitHub (git push && git push --tags)
    
  After the build check under the release tab in Github.
