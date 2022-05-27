The `Http` directory contains your handlers and middleware. Almost all of the logic to handle requests entering your application will be placed in this directory.

In the middleware section, every file that starts with underscore (`_`) gets auto imported into the application.

You can make a handler and store using the following command:

```
npm run make:module [handler_name]
```

You can make a middleware using the following command:

```
npm run make:middleware [middleware_name]
```
