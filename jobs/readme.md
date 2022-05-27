The `Jobs` directory houses the **queueable jobs** for your application. Jobs may be queued by your application or run synchronously within the current request lifecycle

If you don't want to run a job, you can prefix the filename with an underscore(`_`). This way, the application will recognize that this file should not be run.

You can make a job using the following command:

```
npm run make:job [name]
```
