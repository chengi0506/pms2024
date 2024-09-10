const List = ({ todoList, setTodoList }) => {

    const updateTodo = (event) => {
      const { id } = event.target.dataset;
      const newTodoList = todoList.map((todo) => {
        if(todo.id === Number(id)) {
          todo.status = !todo.status;
        }
        return todo;
      });
  
      setTodoList([ ...newTodoList ]);
    }
  
    const template = (todo) => {
      return (
        <li className="py-4" key={ todo.id }>
          <label className={ todo.status ? 'line-through' : ''}>
            <input type="checkbox" className="mr-2" onChange={ updateTodo } data-id={ todo.id } checked={ todo.status }/>
            { todo.name }
          </label>
        </li>
      )
    }
  
    return ( <ul> { todoList.map((todo) => template(todo)) } </ul> )
  }
  
  export default List;