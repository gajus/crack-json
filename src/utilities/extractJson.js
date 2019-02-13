// @flow

type ExtractJsonConfigurationType = {|
  // eslint-disable-next-line flowtype/no-weak-types
  +parser?: (input: string) => any,
  +stringifier?: (input: object) => any
|};

const closeCharacterMap = {
  '"': '"',
  "[": "]",
  "{": "}"
};

const defaultParser = JSON.parse.bind(JSON);
const defaultStringifier = JSON.stringify.bind(JSON);

/**
 * Extracts JSON entities from an arbitrary string.
 */
// eslint-disable-next-line flowtype/no-weak-types
export default (subject: string, configuration?: ExtractJsonConfigurationType): $ReadOnlyArray<any> => {
  const parser = configuration && configuration.parser ? configuration.parser : defaultParser;
  const stringifier = configuration && configuration.stringifier ? configuration.stringifier : defaultStringifier;

  const foundObjects = [];

  const rule = /["[{]/g;

  let subjectOffset = 0;

  while (true) {
    const offsetSubject = subject.slice(subjectOffset);

    const match = rule.exec(offsetSubject);

    if (!match) {
      break;
    }

    const openCharacter = match[0];
    const closeCharacter = closeCharacterMap[openCharacter];

    const startIndex = match.index;

    let haystack = offsetSubject.slice(startIndex);

    while (haystack.length) {
      const addResult = result => {
        foundObjects.push(result);
        subjectOffset += startIndex + haystack.length;
        rule.lastIndex = 0;
      };

      try {
        const result = parser(haystack);
        addResult(result);
        break;
      } catch (error) {
        try {
          const result = parser(stringifier(eval(`(() => { return ${haystack} })()`)));
          addResult(result);
          break;
        } catch (error) {}
      }

      const offsetIndex = haystack.slice(0, -1).lastIndexOf(closeCharacter) + 1;

      haystack = haystack.slice(0, offsetIndex);
    }
  }

  return foundObjects;
};
