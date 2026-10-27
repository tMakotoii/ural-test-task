import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseGoods } from './api.js'

test('parseGoods', () => {
  const stub = { brand: '', goodsID: '00000000-0000-0000-0000-000000000000' }
  assert.deepEqual(parseGoods({ goods: [stub] }), [])
  assert.deepEqual(parseGoods({}), [])
  assert.deepEqual(parseGoods({ goods: [stub, { brand: 'FEBI' }] }), [{ brand: 'FEBI' }])
  assert.throws(() => parseGoods({ error: 'Invalid access key' }), /Invalid access key/)
})
