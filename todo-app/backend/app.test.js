describe('Todo App Basic Tests', () => {
  test('should pass a simple sanity check', () => {
    expect(1 + 1).toBe(2);
  });

  test('todo item should have a title', () => {
    const todo = { id: 1, title: 'Buy groceries', done: false };
    expect(todo.title).toBeDefined();
    expect(todo.done).toBe(false);
  });
});