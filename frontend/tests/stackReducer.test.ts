import { stackReducer, StackState, StackAction } from 'frontend/src/react-state-management/reducers/stackReducer';

describe('stackReducer', () => {
  describe('Add Action', () => {
    test('adds item to empty stack', () => {
      const state: StackState<number> = [];
      const action: StackAction<number> = {
        type: 'add',
        payload: 1,
      };

      const result = stackReducer(state, action);

      expect(result).toEqual([1]);
      expect(result).not.toBe(state); // Should return new array
    });

    test('adds item to non-empty stack', () => {
      const state: StackState<number> = [1, 2, 3];
      const action: StackAction<number> = {
        type: 'add',
        payload: 4,
      };

      const result = stackReducer(state, action);

      expect(result).toEqual([1, 2, 3, 4]);
      expect(result).not.toBe(state); // Should return new array
    });

    test('adds multiple items sequentially', () => {
      let state: StackState<string> = [];
      
      state = stackReducer(state, { type: 'add', payload: 'first' });
      expect(state).toEqual(['first']);

      state = stackReducer(state, { type: 'add', payload: 'second' });
      expect(state).toEqual(['first', 'second']);

      state = stackReducer(state, { type: 'add', payload: 'third' });
      expect(state).toEqual(['first', 'second', 'third']);
    });

    test('adds complex objects to stack', () => {
      interface ComplexObject {
        id: number;
        name: string;
        data: { value: number };
      }

      const state: StackState<ComplexObject> = [];
      const action: StackAction<ComplexObject> = {
        type: 'add',
        payload: { id: 1, name: 'test', data: { value: 42 } },
      };

      const result = stackReducer(state, action);

      expect(result).toEqual([{ id: 1, name: 'test', data: { value: 42 } }]);
    });

    test('adds null and undefined values', () => {
      let state: StackState<number | null | undefined> = [];
      
      state = stackReducer(state, { type: 'add', payload: null });
      expect(state).toEqual([null]);

      state = stackReducer(state, { type: 'add', payload: undefined });
      expect(state).toEqual([null, undefined]);
    });

    test('maintains immutability when adding', () => {
      const state: StackState<number> = [1, 2, 3];
      const originalState = [...state];
      
      const result = stackReducer(state, { type: 'add', payload: 4 });

      expect(state).toEqual(originalState); // Original state unchanged
      expect(result).not.toBe(state); // New array reference
    });
  });

  describe('Remove Action', () => {
    test('removes last item from stack with one element', () => {
      const state: StackState<number> = [1];
      const action: StackAction<number> = {
        type: 'remove',
      };

      const result = stackReducer(state, action);

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    test('removes last item from stack with multiple elements', () => {
      const state: StackState<number> = [1, 2, 3, 4];
      const action: StackAction<number> = {
        type: 'remove',
      };

      const result = stackReducer(state, action);

      expect(result).toEqual([1, 2, 3]);
      expect(result.length).toBe(3);
    });

    test('handles remove on empty stack', () => {
      const state: StackState<number> = [];
      const action: StackAction<number> = {
        type: 'remove',
      };

      const result = stackReducer(state, action);

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    test('removes multiple items sequentially', () => {
      let state: StackState<string> = ['a', 'b', 'c'];
      
      state = stackReducer(state, { type: 'remove' });
      expect(state).toEqual(['a', 'b']);

      state = stackReducer(state, { type: 'remove' });
      expect(state).toEqual(['a']);

      state = stackReducer(state, { type: 'remove' });
      expect(state).toEqual([]);

      // Remove from empty stack
      state = stackReducer(state, { type: 'remove' });
      expect(state).toEqual([]);
    });

    test('maintains immutability when removing', () => {
      const state: StackState<number> = [1, 2, 3];
      const originalState = [...state];
      
      const result = stackReducer(state, { type: 'remove' });

      expect(state).toEqual(originalState); // Original state unchanged
      expect(result).not.toBe(state); // New array reference
    });

    test('removes correct item (LIFO behavior)', () => {
      const state: StackState<number> = [1, 2, 3];
      const result = stackReducer(state, { type: 'remove' });

      // Should remove 3 (last added), not 1 (first added)
      expect(result).toEqual([1, 2]);
      expect(result).not.toContain(3);
      expect(result).toContain(1);
      expect(result).toContain(2);
    });
  });

  describe('Clear Action', () => {
    test('clears empty stack', () => {
      const state: StackState<number> = [];
      const action: StackAction<number> = {
        type: 'clear',
      };

      const result = stackReducer(state, action);

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    test('clears stack with one element', () => {
      const state: StackState<number> = [1];
      const action: StackAction<number> = {
        type: 'clear',
      };

      const result = stackReducer(state, action);

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    test('clears stack with multiple elements', () => {
      const state: StackState<number> = [1, 2, 3, 4, 5];
      const action: StackAction<number> = {
        type: 'clear',
      };

      const result = stackReducer(state, action);

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    test('maintains immutability when clearing', () => {
      const state: StackState<number> = [1, 2, 3];
      const originalState = [...state];
      
      const result = stackReducer(state, { type: 'clear' });

      expect(state).toEqual(originalState); // Original state unchanged
      expect(result).not.toBe(state); // New array reference
    });

    test('returns new empty array instance', () => {
      const state: StackState<number> = [1, 2, 3];
      const result1 = stackReducer(state, { type: 'clear' });
      const result2 = stackReducer(state, { type: 'clear' });

      // Each clear should return a new empty array
      expect(result1).toEqual([]);
      expect(result2).toEqual([]);
      expect(result1).not.toBe(result2); // Different array instances
    });
  });

  describe('Complex Scenarios', () => {
    test('handles add -> remove -> add sequence', () => {
      let state: StackState<number> = [];
      
      state = stackReducer(state, { type: 'add', payload: 1 });
      expect(state).toEqual([1]);

      state = stackReducer(state, { type: 'add', payload: 2 });
      expect(state).toEqual([1, 2]);

      state = stackReducer(state, { type: 'remove' });
      expect(state).toEqual([1]);

      state = stackReducer(state, { type: 'add', payload: 3 });
      expect(state).toEqual([1, 3]);
    });

    test('handles clear -> add sequence', () => {
      let state: StackState<string> = ['a', 'b', 'c'];
      
      state = stackReducer(state, { type: 'clear' });
      expect(state).toEqual([]);

      state = stackReducer(state, { type: 'add', payload: 'new' });
      expect(state).toEqual(['new']);
    });

    test('handles multiple removes until empty, then add', () => {
      let state: StackState<number> = [1, 2];
      
      state = stackReducer(state, { type: 'remove' });
      expect(state).toEqual([1]);

      state = stackReducer(state, { type: 'remove' });
      expect(state).toEqual([]);

      state = stackReducer(state, { type: 'remove' }); // Remove from empty
      expect(state).toEqual([]);

      state = stackReducer(state, { type: 'add', payload: 10 });
      expect(state).toEqual([10]);
    });

    test('handles rapid add/remove operations', () => {
      let state: StackState<number> = [];
      
      // Add multiple items
      for (let i = 1; i <= 10; i++) {
        state = stackReducer(state, { type: 'add', payload: i });
      }
      expect(state).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

      // Remove multiple items
      for (let i = 0; i < 5; i++) {
        state = stackReducer(state, { type: 'remove' });
      }
      expect(state).toEqual([1, 2, 3, 4, 5]);

      // Clear and start over
      state = stackReducer(state, { type: 'clear' });
      expect(state).toEqual([]);

      state = stackReducer(state, { type: 'add', payload: 100 });
      expect(state).toEqual([100]);
    });
  });

  describe('Type Safety and Edge Cases', () => {
    test('works with different generic types', () => {
      // Number type
      let numberState: StackState<number> = [];
      numberState = stackReducer(numberState, { type: 'add', payload: 42 });
      expect(numberState).toEqual([42]);

      // String type
      let stringState: StackState<string> = [];
      stringState = stackReducer(stringState, { type: 'add', payload: 'test' });
      expect(stringState).toEqual(['test']);

      // Boolean type
      let booleanState: StackState<boolean> = [];
      booleanState = stackReducer(booleanState, { type: 'add', payload: true });
      expect(booleanState).toEqual([true]);

      // Object type
      interface TestObj {
        id: number;
      }
      let objectState: StackState<TestObj> = [];
      objectState = stackReducer(objectState, { type: 'add', payload: { id: 1 } });
      expect(objectState).toEqual([{ id: 1 }]);
    });

    test('handles very large stacks', () => {
      let state: StackState<number> = [];
      
      // Add 1000 items
      for (let i = 0; i < 1000; i++) {
        state = stackReducer(state, { type: 'add', payload: i });
      }
      expect(state.length).toBe(1000);
      expect(state[0]).toBe(0);
      expect(state[999]).toBe(999);

      // Remove all items
      for (let i = 0; i < 1000; i++) {
        state = stackReducer(state, { type: 'remove' });
      }
      expect(state.length).toBe(0);
    });

    test('handles nested arrays', () => {
      let state: StackState<number[]> = [];
      
      state = stackReducer(state, { type: 'add', payload: [1, 2, 3] });
      state = stackReducer(state, { type: 'add', payload: [4, 5] });
      
      expect(state).toEqual([[1, 2, 3], [4, 5]]);
      
      state = stackReducer(state, { type: 'remove' });
      expect(state).toEqual([[1, 2, 3]]);
    });

    test('handles functions as payload', () => {
      let state: StackState<() => void> = [];
      const fn1 = () => console.log('1');
      const fn2 = () => console.log('2');
      
      state = stackReducer(state, { type: 'add', payload: fn1 });
      state = stackReducer(state, { type: 'add', payload: fn2 });
      
      expect(state.length).toBe(2);
      expect(state[0]).toBe(fn1);
      expect(state[1]).toBe(fn2);
    });
  });

  describe('Stack Behavior (LIFO)', () => {
    test('maintains Last-In-First-Out order', () => {
      let state: StackState<string> = [];
      
      // Add items
      state = stackReducer(state, { type: 'add', payload: 'first' });
      state = stackReducer(state, { type: 'add', payload: 'second' });
      state = stackReducer(state, { type: 'add', payload: 'third' });
      
      expect(state).toEqual(['first', 'second', 'third']);
      
      // Remove should get 'third' (last in)
      state = stackReducer(state, { type: 'remove' });
      expect(state).toEqual(['first', 'second']);
      
      state = stackReducer(state, { type: 'remove' });
      expect(state).toEqual(['first']);
      
      state = stackReducer(state, { type: 'remove' });
      expect(state).toEqual([]);
    });

    test('correct order after multiple operations', () => {
      let state: StackState<number> = [];
      
      // Build stack: [1, 2, 3, 4, 5]
      for (let i = 1; i <= 5; i++) {
        state = stackReducer(state, { type: 'add', payload: i });
      }
      
      // Remove 2 items: should remove 5, then 4
      state = stackReducer(state, { type: 'remove' });
      state = stackReducer(state, { type: 'remove' });
      expect(state).toEqual([1, 2, 3]);
      
      // Add new item
      state = stackReducer(state, { type: 'add', payload: 6 });
      expect(state).toEqual([1, 2, 3, 6]);
      
      // Remove should get 6
      state = stackReducer(state, { type: 'remove' });
      expect(state).toEqual([1, 2, 3]);
    });
  });
});

