import { sum } from './proof-of-unit-test';

test('adds 1 + 2 to equal 3', () => {
    // change to make the test pass/fail e.g (sum(1,3) -> fails,  sum(1,2) -> passes)
    expect(sum(1, 2)).toBe(3);
});