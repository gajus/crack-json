// @flow

import test from 'ava';
import JSON5 from 'json5';
import extractJson from '../../src/utilities/extractJson';

test('extracts JSON objects', (t) => {
  t.deepEqual(extractJson('{"foo":"bar"}'), [{foo: 'bar'}]);
});

test('extracts JSON arrays', (t) => {
  t.deepEqual(extractJson('[{"foo":"bar"}]'), [[{foo: 'bar'}]]);
});

test('extracts JSON strings', (t) => {
  t.deepEqual(extractJson('"foo"'), ['foo']);
});

test('ignores non-JSON text', (t) => {
  t.deepEqual(extractJson('foo {"foo":"bar"} bar {"baz":"qux"} baz  '), [
    {foo: 'bar'},
    {baz: 'qux'}
  ]);
});

test('ignores unclosed JSON objects', (t) => {
  t.deepEqual(extractJson('{{"foo":"bar"}'), [{foo: 'bar'}]);
});

test('extracts multiple JSON objects', (t) => {
  t.deepEqual(extractJson('{"foo":"bar"}{"baz":"qux"}'), [
    {foo: 'bar'},
    {baz: 'qux'}
  ]);
});

test('uses custom parser', (t) => {
  t.deepEqual(extractJson('foo {"foo":"bar"} bar {baz:"qux"} baz  ', {
    parser: JSON5.parse.bind(JSON5)
  }), [
    {foo: 'bar'},
    {baz: 'qux'}
  ]);
});
