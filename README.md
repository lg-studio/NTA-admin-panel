# NTA-Admin
New York Travel app Admin Panel
## Installing & Running
### OS / Software Requirments: **Node.js** & **ruby**

On Debian (Ubuntu) like systems - to install:
* Node.js:
```sh 
wget https://deb.nodesource.com/setup -O nodejs.sh && chmod +x nodejs.sh
sudo ./node.js && sudo apt-get install nodejs
```
On Windows or Mac - to install * Node.js:

https://nodejs.org/download/

### npm packages
Global npm prerequisites (__bower__, __grunt__, __grunt-cli__):
```sh
sudo npm install -g bower
sudo npm install -g gulp
sudo npm install -g gulp-cli
```

Then **clone** & **npm install**
```sh
git clone nta-admin-panel.git && cd nta-admin-panel
npm install && bower install 
or
npm run setup 
```

### Running / Execution:
Within the working / git directory - on CLI do:
```sh
gulp serve
```

### Distribution builds

In order to generate a distribution build in the `dist` directory, execute the following command:
```sh
gulp build:dist
```

The distribution build can also be generated and immediately hosted locally for verification using the command
```sh
gulp serve:dist
```


### Error on npm install
If your build results in an similar to:
```sh
npm install
  > npm ERR! EEXIST, open '/home/usr/.npm/98a88d3a-hdi-npm-mkdirp-0-5-0-package-tgz.lock'
  > File exists: /home/usr/.npm/98a88d3a-hdi-npm-mkdirp-0-5-0-package-tgz.lock
  > Move it away, and try again.
```
To fix - run the following after installing _bower_:
```sh
sudo npm -g install npm@next
```
Then proceed with install as described above.