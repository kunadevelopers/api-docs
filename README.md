# Kuna API v3 Overview

The base URL for API request
`https://api.kuna.io`


### Signature calculate by
```
HEX(
    HMAC-SHA384(
      {requestPath} + {nonce} + JSON({requestBody}),
      {apiSecret}
    )
)
```

### JavaScrip example
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
