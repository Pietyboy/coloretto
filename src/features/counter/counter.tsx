import { useDispatch, useSelector } from 'react-redux';

import { decrement, increment } from '../../store/slices/counter-slice';

type TState = {
    counter: {
        value: number;
    }
};
export function Counter() {
  const count = useSelector((state: TState) => state.counter.value)
  const dispatch = useDispatch()

  return (
    <div>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <span>{count}</span>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
      </div>
    </div>
  )
}