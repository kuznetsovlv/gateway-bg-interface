# gateway-bg-interface

Back-end interface of gateway project, test task

## Description
Provides interface of client-server interaction for project gateway. API described in the [openapi.yaml](./openapi.yaml) file. You can read it with [https://app.swaggerhub.com/](https://app.swaggerhub.com/).

## Usage:
```shell
npm install gateway-bg-interface
````

In the code:

```javascript
import Server, {DataProviderInterface} from 'gateway-bg-interface';

//Proxy class to interact with DB.
class DataProvider extends DataProviderInterface {
    //Implement methods here
}

const port = 8080; //Server port (optional, by default 8080)

const server = new Server(new DataProvider(), port);
server.start();
```

## License

[MIT](./LICENSE 'MIT') Copyright (c) 2023 kuznetsovlv
