# Twitter Search

Twitter Search is a web application that searches for recent tweets based on a provided query. The queried tweets are then analyzed using sentiment analysis to determine if they are of positive or negative nature.  


## Installation

* Prerequisite: [Node.js](https://nodejs.org/en/) 
* Prerequisite: [GruntJS](http://gruntjs.com/getting-started) 
* Prerequisite: [Bower](http://bower.io/#install-bower)  

```
npm install 
npm run setup
```

## Server

1. [Configure](https://github.com/maxcarter/TwitterSearch/blob/master/server/config.js) the server with your Twitter consumer_key and consumer_secret. You can obtain these credentials by [creating a Twitter App](https://apps.twitter.com/)
2. [Build](https://github.com/maxcarter/TwitterSearch#build) the front-end.
4. Start the Node.js server by running the following command: `npm start`
5. Wait until you see `The server is now ready to accept requests.`
6. Open the app in you browser at [http://localhost:3000](http://localhost:3000)

## Cloud Foundry

* Prerequisite: [Cloud Foundry CLI](https://github.com/cloudfoundry/cli)

This application has been configured to work on a [Cloud Foundry](https://www.cloudfoundry.org/) PaaS that supports Mongo DB. Before pushing to the cloud ensure that you have logged in using `cf login

```
grunt
cf push
```

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
* [Mongo DB](https://www.mongodb.org/) NoSQL database
* [AngularJS](https://angularjs.org/) frontend
* [Bootstrap](http://getbootstrap.com/) styling
* [Grunt](http://gruntjs.com/) task management 
* [Bower](http://bower.io/) package management
* [Karma](https://karma-runner.github.io/0.13/index.html) testing

## API

There is only one endpoint in this api `/twitter/search/tweets`. This endpoint performs an HTTPS GET request to the [Twitter Search API](https://dev.twitter.com/rest/reference/get/search/tweets). Once data is received it is analyzed using [sentiment](https://github.com/thisandagain/sentiment) analysis, stored in a Mongo DB database, and returned in response to the request.

### Parameters
* `q`: The Twitter search query
* `count`: The number of tweets to return per page, up to a maximum of 100
* `sentiment`: The tweet sentiment filter (positive, negative, neutral)

When a sentiment is set, the endpoint behaves slightly different. First a request is made to the Twitter Search API to obtain recent tweets related to the query. Next sentiment analysis is performed on the tweets and they are saved to the database as usual. The data is then filtered based on the specified sentiment, this will remove all tweets that do not match the requested sentiment. To fill the holes left by the filtering, the database is queried to find the remaining most recent tweets related to the query with the requested sentiment. Finally, the combined data is returned in response to the request.

### Sample Request
```
http://localhost:3000/twitter/search/tweets?q=Example
```

## Development

### Package installation

Front-End: 

```
bower install --save <Name of Package>
```

Back-End:


```
npm install --save <Name of Package>
```

Dev:


```
npm install --save-dev <Name of Package>
```

### Modes

This app is bundled with two modes: Dev-Mode and Prod-Mode. 

**Dev-Mode**


`http://localhost:3000/dev`


Dev-Mode is mapped to the `app` directory and contains editable source code. In this mode you can edit source code and preview the changes directly in the browser without building the project.


**Prod-Mode**


`http://localhost:3000`


Prod-Mode is mapped to the `dist` directory. This mode is the compiled, compressed and tested version of the tool that should be used for production instances. 


**Switching from Dev to Prod**

As a standard, all new features should be made in Dev-Mode then compiled into Prod-Mode once completed. To switch from Dev-Mode to Prod-Mode simply [Build the project](https://github.com/maxcarter/TwitterSearch#build).





