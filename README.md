# Документаций по Kuna API v3

API организовано по принципам REST.
Все методы делятся на публичный (public) и приватные (private).

Для того что бы осущевствлять приватные запросы, вы должны быть зерегистрированным пользователем на сайте (kuna.io)[https://kuna.io], и иметь специальный API Token который состоит из публичного (`publicKey`) и приватного (`privateKey`) ключей.

Для публичных методов ключ не нужен.

## Схема и сериализация данных в API

### Запросы
Доступ к данным осуществляется через стандартные HTTPS запросы в кодировке UTF-8. Данные отправляется и принимаются в формате JSON.

### Домен
Для всех методов, публичных или приватных, используеся один домен:
```https://api.kuna.io```

К примеру, URL для получения актуального стакана заявок (`{market}` это ключ пары, `btcuah` или `kunbtc`).
```https://api.kuna.io/v3/book/{market}```


### Подпись формируется по формуле
```
HEX(
    HMAC-SHA384(
      {requestPath} + {nonce} + JSON({requestBody}),
      {apiSecret}
    )
)
```

### Пример подписи с использованием JavaScript
```javascript
const crypto = require('crypto');

const apiKey = '';
const apiSecret = '';

const apiPath = '/v3/auth/kuna_codes/issued-by-me';
const nonce = new Date().getTime();
const body = {};

const signatureString = `${apiPath}${nonce}${JSON.stringify(body)}`;

const signature = crypto.createHmac('sha384', apiSecret).update(signature);
const signatureHex = sig.digest('hex');

console.log(signatureHex);
```
