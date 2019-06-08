# Документаций по Kuna API v3

API организовано по принципам REST.
Все методы делятся на публичные (public) и приватные (private).

Для того что бы осуществлять приватные запросы, вы должны быть зерегистрированным пользователем на сайте [kuna.io](https://kuna.io), и иметь специальный **API Token**, который состоит из публичного (`publicKey`) и приватного (`privateKey`) ключей.

Для публичных методов ключ не нужен.

API Token можно получить у себя в кабинете, по ссылке https://kuna.io/api_tokens.

## Схема и сериализация данных в API

### Запросы
Доступ к данным осуществляется через стандартные HTTPS запросы в кодировке UTF-8. Данные отправляется и принимаются в формате JSON.


### Домен
Для всех методов, публичных или приватных, используеся один домен
```
https://api.kuna.io
```


К примеру, URL для получения актуального стакана заявок
```
https://api.kuna.io/v3/book/{market}
```
где `{market}` это ключ пары, `btcuah`, `kunbtc` или другой


### Заголовки (Headers)
Заголовки, которые нужны для успешного запроса.

| Заголовок     | Описание                       |
|---------------|--------------------------------|
| Accept        | Должен быть `application/json` |
| Content-Type  | Только для запросов где есть тело. Должен быть `application/json` |
| Kun-Nonce     | Метка времени запроса. Указывается в формате Unix Time Stamp в милисекундах (ms). Только для приватных методов. |
| Kun-ApiKey    | Публичный ключ вашего API Token. Только для приватных методов. |
| Kun-Signature | Подпись запроса. Только для приватных методов. |



### Подпись для приватных запросов
Подпись нужно указать в заголовке запроса под ключем `Kun-Signature`.

Она формируется по формуле
```
HEX(
    HMAC-SHA384(
      {apiPath} + {nonce} + JSON({body}),
      {privateKey}
    )
)
```

Где,

| Значение        | Описание        |
| --------------- | --------------- |
| `{apiPath}` | Метод, к примеру `/v3/auth/kuna_codes/count` |
| `{nonce}` | Метка времени запроса. Указывается в формате Unix Time Stamp в милисекундах (ms). Это же значние должно быть и в заголовке под ключем `Kun-Nonce` |
| `{body}` | Данные, которые передаются в теле запроса. Должны быть в формате JSON. В случае `GET` запросов, когда тело не передается, используется пустой JSON объект - `{}`. |
| `{privateKey}` | Приватный ключ вашего API Token |


#### Пример подписи с использованием JavaScript

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

console.log(signatureHex); // выведет подпись запроса в HEX формате
```


### Пример приватного запроса с CURL

```
curl -X GET \
    https://api.kuna.io/v3/auth/kuna_codes/issued-by-me \
    -H 'Accept: application/json' \
    -H 'Kun-Nonce: 1560007410000' \
    -H 'Kun-ApiKey: vPNvF9ArqV4HqMzpAIyaLvToJJ1x1rfRZP5jNrQf' \
    -H 'Kun-Signature: 0d34c19a5125d68fe2e7fb3a3b58e162cc53e166d1e7790deb5d79f6cb04aad1d5e01daeb3ecf8871c3b767a8ea289ea'
```
###### Не пытайтесь использовать этот API Key. Он для примера :)
