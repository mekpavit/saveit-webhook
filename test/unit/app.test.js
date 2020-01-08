import getStateFromText from '../../src/app.js'


describe('getStateFromText function', () => {
  test('it should return 0 if text in eventObject is not `พอ`', () => {
    const text = 'อะไรก็ไม่รู้ อยากให้ช่วยจำหน่อย'
    const state = getStateFromText(text)
    expect(state).toBe(0)
  })
})