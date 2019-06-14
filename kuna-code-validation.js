function validateKunaCode(kunaCode) {
    const base58Alphabet = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';

    if(!kunaCode || kunaCode.length < 1) {
        throw new Error('Missing Kuna Code');
    }

    const segments = kunaCode.split('-');
    const sufix = segments.slice(-2);
    const body = segments.slice(0, -2);
    if (sufix[1] !== 'KCode' || body.length !== 9) {
        throw new Error('Invalid format');
    }

    // Check KunaCode checksum
    const checksum = base58Alphabet.indexOf(body[0][0]);

    const str = body.join('').slice(1);
    let i = str.length;
    let sum = 0;
    while (i--) {
        sum += base58Alphabet.indexOf(str.charAt(i));
    }

    if (sum % 58 !== checksum) {
        throw new Error('Invalid checksum');
    }
}


try {
    validateKunaCode(); // missing
} catch(error) {
    console.log('1) Missing Kuna Code -> ', error.message);
}


try {
    validateKunaCode('r4wR3-vjUHK-UHYBi-iBkra-hMeqU-L74aD-scBcR-BTC-KCode'); // invalid format
} catch(error) {
    console.log('2) Invalid format -> ', error.message);
}


try {
    validateKunaCode('r4wR3-vjUHK-s6AhZ-UHYBi-ickra-hMeqU-vp3uh-L74aD-scBcR-BTC-KCode'); // invalid checksum
} catch(error) {
    console.log('3) Invalid checksum -> ', error.message);
}



// valid code
try {
    validateKunaCode('r4wR3-vjUHK-s6AhZ-UHYBi-iBkra-hMeqU-vj3uh-L74aD-scBcR-BTC-KCode');
    console.log('4) Code Valid!');
} catch (error) {}
