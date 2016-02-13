# Twitter-Search

Twitter-Search is a web application that searches for recent tweets.


## Installation

* Prerequisite: [Node.js](https://nodejs.org/en/) 
* Prerequisite: [GruntJS](http://gruntjs.com/getting-started) 
* Prerequisite: [Bower](http://bower.io/#install-bower)  

```
npm install 
```

## Server

1. [Configure](https://github.com/maxcarter/TwitterSearch/blob/master/server/config.js) the server with your Twitter consumer_key and consumer_secret. You can obtain these credentials by [creating a Twitter App](https://apps.twitter.com/)
2. [Build](https://github.com/maxcarter/TwitterSearch#build) the front-end.
4. Start the Node.js server by running the following command: `npm start`
5. Wait until you see `The server is now ready to accept requests.`
6. Open the app in you browser at [http://localhost:3000](http://localhost:3000)

## Build

```
grunt
```

## Test

```
grunt test
```

## Tech Specs

* [Yeoman](http://yeoman.io/) scaffolding
* [Node.js](https://nodejs.org/en/) backend
* [AngularJS](https://angularjs.org/) frontend
* [Bootstrap](http://getbootstrap.com/) styling
* [Grunt](http://gruntjs.com/) task management 
* [Bower](http://bower.io/) package management
* [Karma](https://karma-runner.github.io/0.13/index.html) testing


## To do:

* Mobile optimization 
* Better error handeling on the server
* Upload to a public cloud infrastructure 
* NoSQL database integrations
* Visualization of tweets
* Sentiment Analysis of tweets


