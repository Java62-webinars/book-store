import Decimal from "decimal.js";

const priceA = 19.99;
const priceB = 19.50;
const wrongSum = priceA + priceB;
console.log(wrongSum);
//Cosmetic decision
console.log(wrongSum.toFixed(2));
//Minor units decision
// const priceAminor = 1999;
// const priceBminor = 1950;
function toCents(price) {
    return Math.round(Number(price) * 100);
}

function formatMoneyFromCents(cents, currency = "$") {
    return `${currency}${(cents / 100).toFixed(2)}`;
}

const correctSum = toCents(priceA) + toCents(priceB);
console.log(correctSum);
console.log(formatMoneyFromCents(correctSum));
console.log(formatMoneyFromCents(1050));

function money(value) {
    return new Decimal(value);
}

const decimalSum = money(priceA).plus(priceB);
console.log(decimalSum);

function formatDecimalMoney(value, currency = "$") {
    return `${currency}${money(value)}`;
}

console.log(formatDecimalMoney(decimalSum));

const formatters = {
    shekel: new Intl.NumberFormat("he-IL", {
        style: "currency",
        currency: "ILS",
    }),
    euro: new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
    }),
    dollar: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }),
    rubles: new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
    })
};
console.log("ILS:", formatters.shekel.format(wrongSum));
console.log("EU:", formatters.euro.format(wrongSum));
console.log("US:", formatters.dollar.format(wrongSum));
console.log("RU:", formatters.rubles.format(wrongSum));

const dateFormatters = {
    isrTime: new Intl.DateTimeFormat("he-IL", {
        dateStyle: 'full',
        timeStyle: 'medium',
    }),
    germanTime: new Intl.DateTimeFormat("de-DE", {
        dateStyle: 'full',
        timeStyle: 'short',
    }),
    usTime: new Intl.DateTimeFormat("en-US", {
        dateStyle: 'medium',
        timeStyle: 'short',
    }),
    ruTime: new Intl.DateTimeFormat("ru-RU", {
        dateStyle: 'short',
        timeStyle: 'full',
    }),
};

console.log("ILS:", dateFormatters.isrTime.format(Date.now()));
console.log("EU:", dateFormatters.germanTime.format(Date.now()));
console.log("US:", dateFormatters.usTime.format(Date.now()));
console.log("RU:", dateFormatters.ruTime.format(Date.now()));

// console.log(new Intl.DateTimeFormat("en-US", {
//     dateStyle: 'full',
//     timeStyle: 'short',
// }).format(Date.now()))