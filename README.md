# API project template


## \# Directory structure
```
- app.js // application starting point
* services // application specific structure
    * http // http related code
        * handlers // register endpoints here
        * middleware // common middleware among handlers
        - index.js  // registers http specific configurations, plugins for koa should be registered here
        - router.js // autoloads all files under handlers
    * tcp // start tcp connections here
    * ws // websocket handlers here
    - index.js // register services here e.g. http or ws, if you have specific service register  it here
* store // database queries and cache implementation here
* utilities // common functionality
    - mysql.js
    - redis.js
* config // extra configuration
```


## npm Commands
* `npm run dev`: run development server and lint; auto reloads on code change
* `npm run test`: runs linter
