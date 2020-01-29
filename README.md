# crack-json 🥊

[![Travis build status](http://img.shields.io/travis/gajus/crack-json/master.svg?style=flat-square)](https://travis-ci.org/gajus/crack-json)
[![Coveralls](https://img.shields.io/coveralls/gajus/crack-json.svg?style=flat-square)](https://coveralls.io/github/gajus/crack-json)
[![NPM version](http://img.shields.io/npm/v/crack-json.svg?style=flat-square)](https://www.npmjs.org/package/crack-json)
[![Canonical Code Style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)
[![Twitter Follow](https://img.shields.io/twitter/follow/kuizinas.svg?style=social&label=Follow)](https://twitter.com/kuizinas)

Extracts all JSON objects from an arbitrary text document.

* [Use case](#use-case)
* [Implementation](#implementation)
* [API](#api)
  * [`extractJson` API](#extractjson-api)
* [Usage](#usage)
  * [Filtering out matches](#filtering-out-matches)

## Use case

The primary use-case is extracting structured data from non-structured documents, e.g. when scraping websites, it is common that HTML embeds JSON or JSON-like data structures.

```html
<script>
$(document).on('BookingApp:SeatingPlan:Ready', () => {
  $(document).trigger('BookingApp:StartSeatingPlanOnly', {
    "sessionId": "438a8373-5fab-4d36-ac92-053ae2d04e9c"
  });
});
</script>

```

The way that the `crack-json` is intended to be used is that the scraper must narrow down the document to the HTML containing the subject JSON data and then `crack-json` is used to extract all JSON-like objects. If in the above example we are interested in extracting the `sessionId`, then it would be sufficient to get `innerHTML` of the `script` tag, use `crack-json` to extract all JSON-like objects, and search for the matching object, e.g.

```js
const session = extractJson(document.querySelector('script').innerHTML)
  .find((maybeTargetSubject) => {
    return maybeTargetSubject.sessionId;
  });

session;
// {
//   "sessionId": "438a8373-5fab-4d36-ac92-053ae2d04e9c"
// }

```

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
 * @property filter Used to filter out strings before attempting to decode them.
 * @property parser A parser used to extract JSON from the suspected strings. Default: `JSON.parse`.
 */
type ExtractJsonConfigurationType = {|
  +filter?: (input: string) => boolean,
  +parser?: (input: string) => any,
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

### Filtering out matches

You can use `filter` to exclude strings before they are parsed using an arbitrary condition. This will improve performance and reduce output only to the desirable objects, e.g.

```html
import {
  extractJson
} from 'crack-json';

const payload = `
  <script>
  const foo = {
    cinemaId: '1',
  };
  const bar = {
    venueId: '1',
  };
  const baz = {
    userId: '1',
  };
  </script>
`;

console.log(extractJson(payload, {
  filter: (input) => {
    return input.includes('userId')
  },
}));

```

Output:

```js
[
  {
    userId: '1',
  },
]

```
