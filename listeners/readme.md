The **`Listeners`** directory contains the classes that handle your **events**. Event listeners receive an event instance and perform logic in response to the event being fired. For example, a **UserRegistered** event might be handled by a **SendWelcomeEmail** listener. Listeners usually contain heavy operations

If you don't want to run a listener, you can prefix the filename with an underscore(`_`). This way, the application will recognize that this file should not be run.

You can make a listener using the following command:

```
npm run make:listener [name]
```

Listening to redis events
```
const redis = require('@config/redis')

// socket:[USER_EVENT_TYPE]:[NAMESPACE]:[EVENT_NAME]

await redis.subscribe('socket:user_events:test:insert', function () {
  console.log('test')
})