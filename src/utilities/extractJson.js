// @flow

type ExtractJsonConfigurationType = {|
  +filter?: (input: string) => boolean,

  // eslint-disable-next-line flowtype/no-weak-types
  +parser?: (input: string) => any,
|};

const closeCharacterMap = {
  '"': '"',
  '[': ']',
  '{': '}',
};

const defaultParser = JSON.parse.bind(JSON);

/**
 * Extracts JSON entities from an arbitrary string.
 */
// eslint-disable-next-line flowtype/no-weak-types
export default (subject: string, configuration?: ExtractJsonConfigurationType): $ReadOnlyArray<any> => {
  const parser = configuration && configuration.parser ? configuration.parser : defaultParser;
  const filter = configuration && configuration.filter;

  const foundObjects = [];

  const rule = /["[{]/g;

  let subjectOffset = 0;

  while (true) {
    const offsetSubject = subject.slice(subjectOffset);

    const openCharacterMatch = rule.exec(offsetSubject);

    if (!openCharacterMatch) {
      break;
    }

    const openCharacter = openCharacterMatch[0];
    const closeCharacter = closeCharacterMap[openCharacter];

    const startIndex = openCharacterMatch.index;

    let haystack = offsetSubject.slice(startIndex);

    while (haystack.length) {
      if (!filter || filter(haystack)) {
        try {
          const result = parser(haystack);

          foundObjects.push(result);

          subjectOffset += startIndex + haystack.length;

          rule.lastIndex = 0;

          break;
        } catch (error) {
          //
        }
      }

      const offsetIndex = haystack.slice(0, -1).lastIndexOf(closeCharacter) + 1;

      haystack = haystack.slice(0, offsetIndex);
    }
  }

  return foundObjects;
};
