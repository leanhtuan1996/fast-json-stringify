'use strict'

const test = require('tap').test
const build = require('..')

test('patternProperties', (t) => {
  t.plan(1)
  const stringify = build({
    title: 'patternProperties',
    type: 'object',
    properties: {
      str: {
        type: 'string'
      }
    },
    patternProperties: {
      'foo': {
        type: 'string'
      }
    }
  })

  let obj = { str: 'test', foo: 42, ofoo: true, foof: 'string', objfoo: {a: true}, notMe: false }
  t.equal('{"foo":"42","ofoo":"true","foof":"string","objfoo":"[object Object]","str":"test"}', stringify(obj))
})

test('patternProperties should not change properties', (t) => {
  t.plan(1)
  const stringify = build({
    title: 'patternProperties should not change properties',
    type: 'object',
    properties: {
      foo: {
        type: 'string'
      }
    },
    patternProperties: {
      foo: {
        type: 'number'
      }
    }
  })

  const obj = { foo: '42', ofoo: 42 }
  t.equal('{"ofoo":42,"foo":"42"}', stringify(obj))
})

test('patternProperties - string coerce', (t) => {
  t.plan(1)
  const stringify = build({
    title: 'check string coerce',
    type: 'object',
    properties: {},
    patternProperties: {
      foo: {
        type: 'string'
      }
    }
  })

  const obj = { foo: true, ofoo: 42, arrfoo: ['array', 'test'], objfoo: { a: 'world' } }
  t.equal('{"foo":"true","ofoo":"42","arrfoo":"array,test","objfoo":"[object Object]"}', stringify(obj))
})

test('patternProperties - number coerce', (t) => {
  t.plan(1)
  const stringify = build({
    title: 'check number coerce',
    type: 'object',
    properties: {},
    patternProperties: {
      foo: {
        type: 'number'
      }
    }
  })

  const obj = { foo: true, ofoo: '42', xfoo: 'string', arrfoo: [1, 2], objfoo: { num: 42 } }
  t.equal('{"foo":1,"ofoo":42,"xfoo":null,"arrfoo":null,"objfoo":null}', stringify(obj))
})

test('patternProperties - boolean coerce', (t) => {
  t.plan(1)
  const stringify = build({
    title: 'check boolean coerce',
    type: 'object',
    properties: {},
    patternProperties: {
      foo: {
        type: 'boolean'
      }
    }
  })

  const obj = { foo: 'true', ofoo: 0, arrfoo: [1, 2], objfoo: { a: true } }
  t.equal('{"foo":true,"ofoo":false,"arrfoo":true,"objfoo":true}', stringify(obj))
})

test('patternProperties - object coerce', (t) => {
  t.plan(1)
  const stringify = build({
    title: 'check object coerce',
    type: 'object',
    properties: {},
    patternProperties: {
      foo: {
        type: 'object',
        properties: {
          answer: {
            type: 'number'
          }
        }
      }
    }
  })

  const obj = { objfoo: { answer: 42 } }
  t.equal('{"objfoo":{"answer":42}}', stringify(obj))
})

test('patternProperties - array coerce', (t) => {
  t.plan(1)
  const stringify = build({
    title: 'check array coerce',
    type: 'object',
    properties: {},
    patternProperties: {
      foo: {
        type: 'array',
        items: {
          type: 'string'
        }
      }
    }
  })

  const obj = { foo: 'true', ofoo: 0, arrfoo: [1, 2], objfoo: { tyrion: 'lannister' } }
  t.equal('{"foo":["t","r","u","e"],"ofoo":[],"arrfoo":["1","2"],"objfoo":[]}', stringify(obj))
})

test('patternProperties - throw on unknown type', (t) => {
  t.plan(1)
  const stringify = build({
    title: 'check array coerce',
    type: 'object',
    properties: {},
    patternProperties: {
      foo: {
        type: 'strangetype'
      }
    }
  })

  const obj = { foo: 'true', ofoo: 0, arrfoo: [1, 2], objfoo: { tyrion: 'lannister' } }
  try {
    stringify(obj)
    t.fail()
  } catch (e) {
    t.pass()
  }
})
