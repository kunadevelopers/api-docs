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


### Пример приватного запроса с cURL

```bash
curl -X GET \
    https://api.kuna.io/v3/auth/kuna_codes/issued-by-me \
    -H 'Accept: application/json' \
    -H 'Kun-Nonce: 1560007410000' \
    -H 'Kun-ApiKey: vPNvF9ArqV4HqMzpAIyaLvToJJ1x1rfRZP5jNrQf' \
    -H 'Kun-Signature: 0d34c19a5125d68fe2e7fb3a3b58e162cc53e166d1e7790deb5d79f6cb04aad1d5e01daeb3ecf8871c3b767a8ea289ea'
```
###### Не пытайтесь использовать этот API Key. Он для примера :)


## Публичные методы

### Время на сервере

```
GET /v3/timestamp
```

**Ответ**

```json
{
  "timestamp": 1560005994,
  "timestamp_miliseconds": 1560005994692
}
```


### Список доступных валют
Вернет список валют, доступных на Kuna.

```
GET /v3/currencies
```

**Ответ**

```json
[
  {
    "id": 2,
    "code": "btc",
    "name": "Bitcoin",
    "has_memo": false,
    "icons": {
      "std": "https://kuna.io/icons/currency/std/btc.svg",
      "xl": "https://kuna.io/icons/currency/xl/btc.svg",
      "png_2x": "https://kuna.io/icons/currency/png/BTC@2x.png",
      "png_3x": "https://kuna.io/icons/currency/png/BTC@3x.png"
    },
    "coin": true,
    "explorer_link": "https://www.blockchain.com/btc/tx/#{txid}",
    "sort_order": 5,
    "precision": {
      "real": 8,
      "trade": 6
    }
  }
]
```

### Курс валюты на бирже
```
GET /v3/exchange-rates/{?currency}
```

### Список доступных рынков
```
GET /v3/markets
```

### Последние данные по рынку
Этот метод возвращает тикеры по всем рынкам, либо по конкретному.
Тикер представляет собой общий обзор состояния рынка. Он показывает текущую лучшую цену спроса и предложения, а также цену последней сделки. Он также включает в себя информацию, такую как дневной объем и сколько цена изменилась за последний день.

```
GET /v3/tickers?symbols={symbols}
```

```bash
# Вернет информацию по btcuah, kunbtc и ethuah
curl https://api.kuna.io/v3/tickers?symbols=btcuah,kunbtc,ethuah

# Вернет информацию только по рынку btcuah
curl https://api.kuna.io/v3/tickers?symbols=btcuah

# Вернет информацию по всем активным рынкам
curl https://api.kuna.io/v3/tickers?symbols=ALL
```

**Пример ответа**
```bash
[
  [
    "btcuah",   # символ рынка
    208001,     # цена BID
    11200693,   # размер стакана BID
    208499,     # цена ASK
    29.255569,  # размер стакана ASK
    5999,       # изменение цены за 24 часа в котируемой валюте 
    -2.8,       # изменение цены за 24 часа в процентах
    208001,     # последняя цена
    11.3878,    # объем торгов за 24 часа в базовой валюте
    215301,     # максимальная цена за 24 часа
    208001      # минимальная цена за 24 часа
  ]
]
```

### Биржевой стакан
```
GET /v3/book/{symbol}
```


## Kuna Codes
Также на бирже 
