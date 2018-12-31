# crack-json 🥊

[![Travis build status](http://img.shields.io/travis/gajus/crack-json/master.svg?style=flat-square)](https://travis-ci.org/gajus/crack-json)
[![Coveralls](https://img.shields.io/coveralls/gajus/crack-json.svg?style=flat-square)](https://coveralls.io/github/gajus/crack-json)
[![NPM version](http://img.shields.io/npm/v/crack-json.svg?style=flat-square)](https://www.npmjs.org/package/crack-json)
[![Canonical Code Style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)
[![Twitter Follow](https://img.shields.io/twitter/follow/kuizinas.svg?style=social&label=Follow)](https://twitter.com/kuizinas)

Extracts all JSON objects from an arbitrary text document.

## Implementation

`crack-json` iterates through the input text by searching for characters that indicate the start of a JSON object, array or text entity, and attempts to match the closing character and parse the resulting string. `crack-json` iterates through document this way until it finds all text entities that can be parsed as JSON.

## API

`crack-json` extracts a single function: `extractJson`.

```js
import {
  extractJson
} from 'crack-json';

```

### `extractJson` API

```js
/**
 * @property parser A parser used to extract JSON from the suspected strings. Default: `JSON.parse`.
 */
type ExtractJsonConfigurationType = {|
  +parser?: (input: string) => any
|};

type ExtractJsonType = (subject: string, configuration?: ExtractJsonConfigurationType) => any;

extractJson: ExtractJsonType;

```

## Usage

```js
import {
  extractJson
} from 'crack-json';

const payload = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ultricies laoreet malesuada. In feugiat augue non tristique pharetra. Duis nisl odio, vulputate maximus suscipit sit amet, ultrices vel lacus.

{"foo": "bar"}

Suspendisse volutpat risus id nibh lacinia, in placerat urna luctus. Phasellus condimentum nec ipsum ut tincidunt. Nullam aliquam euismod ante, vitae accumsan leo egestas a. Aliquam sed lacus nisl. Pellentesque nec hendrerit sem.

[{"baz": "qux"}]

Phasellus iaculis dui nec purus imperdiet placerat non sit amet odio. Donec pretium, arcu ac suscipit imperdiet, tellus orci convallis leo, non laoreet tortor lectus at dolor. Aenean tellus diam, imperdiet nec eleifend at, fermentum sit amet tellus. Vestibulum id purus ac mauris eleifend iaculis.

"quux"

Vestibulum sit amet quam tellus. Nulla facilisi.

`;

console.log(extractJson(payload));

```

Output:

```js
[
  {
    foo: 'bar'
  },
  [
    {
      baz: 'qux'
    }
  ],
  'quux'
]

```
