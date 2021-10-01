# Better Sublists

A wrapper around the Suitescript N/record module that makes working with sublists easier and more flexible

## Installation

If you're NetSuite development environment supports NPM you can install simply running 

```bash
npm install better-sublists
```

Otherwise, you can upload `index.js` to the File Cabinet and reference it in the call to `define` in your script:

```js
define(["require", "exports", "N/record", "../netsuite_modules/better-sublists/index"], function (require, exports, record, betterSublists) {
    // Your code here...
}
```


## Usage

A complete list of methods can be found in `dist/index.d.ts`. If you don't use TypeScript (I feel sorry for you), see [this guide](https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html)

Usage of this module always starts by calling `getSublist`.

Once you have a `Sublist` you can fetch a line directly with `getLine` or iterate over the entire sublist using `forEach`. The `Sublist` type is also an iterable type so you can use a traditional for loop:

```ts
for (const line of getSublist(record, 'sublistId')) {
    // line is an instance of a SublistLine
}
```

The `Sublist` type support most methods you'd expect to see on an array like `map`, `filter`, and `reduce`. You can also call `collect` to convert the `Sublist` type into an array of `SublistLine` instances.

Fields can be accessed by calling `getField` on a `SublistLine`. The `SublistField` type contains three methods.

- `getValue` fetches the value from the field. This is the same as the native Netsuite `getSublistValue` function.

- `setValue` sets a value in the field. This is a same as the native Netsuite `setSublistValue` function.

- `modifyValue` accepts a closure with the current field value as the input and you return the value you want to set in the field.

Both `setValue` and `modifyValue` return an instance of a `SublistLine` so you can chain another `getField` onto it to set multiple values in a single chain.

## Examples

```ts
import { getSublist } from 'better-sublists'
const rec = record.load({ type: 'invoice', id: 1234 });

// Set the first line quantity to zero
getSublist(rec, 'item').getLine(0).getField('quantity').setValue(0);

// Summing the total amount for a given item on an invoice
const total = getSublist(rec, 'item')
    .filter(line => line.getField('item').getValue() === '4321')
    .map(line => line.getField('amount').getValue())
    .reduce((acc, curr) => acc + curr);

// Applying a 10% discount on items with a quantity over 10 and marking the item as discounted
for (const line of getSublist(rec, 'item')) {
    if (line.getField('quantity').getValue() > 10) {
        line.getField('rate')
            .modifyValue(rate => rate * 0.9)
            .getField('description')
            .modifyValue(desc => 'Bulk Discount: ' + desc)
    }
}
```

