import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectTodos, selectFilter, setOverdue, updateOrder } from '../features/todos/todosSlice';
import { List, Typography } from 'antd';
import { DragDropContext, Droppable, Draggable, DropResult  } from 'react-beautiful-dnd';
import TodoItem from './TodoItem';

const TodoList: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector(selectTodos);
  const filter = useSelector(selectFilter);

  useEffect(() => {
    dispatch(setOverdue());
  }, [dispatch, todos]);

  const getFilteredTodos = () => {
    switch (filter) {
      case 'completed':
        return todos.filter(todo => todo.completed);
      case 'incomplete':
        return todos.filter(todo => !todo.completed);
      case 'overdue':
        return todos.filter(todo => todo.overdue);
      default:
        return todos;
    }
  };

  const filteredTodos = getFilteredTodos();

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reorderedTodos = Array.from(filteredTodos);
    const [movedTodo] = reorderedTodos.splice(result.source.index, 1);
    reorderedTodos.splice(result.destination.index, 0, movedTodo);

    // Dispatch action to update the order in the state
    dispatch(updateOrder(reorderedTodos));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="todos">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            <List
              bordered
              dataSource={filteredTodos}
              renderItem={(todo, index) => (
                <Draggable key={todo.id} draggableId={todo.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        userSelect: 'none',
                        padding: 16,
                        margin: '0 0 8px 0',
                        backgroundColor: snapshot.isDragging ? '#ccc' : 'white',
                        ...provided.draggableProps.style,
                      }}
                    >
                      <TodoItem todo={todo} />
                    </div>
                  )}
                </Draggable>
              )}
              locale={{ emptyText: <Typography.Text type="secondary">No todos to show.</Typography.Text> }}
            >
              {provided.placeholder}
            </List>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TodoList;
