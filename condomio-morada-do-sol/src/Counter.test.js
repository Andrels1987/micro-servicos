import {act, fireEvent, render, renderHook} from '@testing-library/react'
import useCounter  from './useCounter'




describe('Counter hook', function(){
    
       
    test('should show initial value as 0', () => { 

        const { result } = renderHook(useCounter);

        expect(result.current.counter).toBe(0);
     })
    test('should show initial value as 10', () => { 

        const { result } = renderHook(useCounter, {
            initialProps: {
                initialCounter: 10
            }
        });

        expect(result.current.counter).toBe(10);
     })
    test('should increment value to  11', () => { 

        const { result } = renderHook(useCounter, {
            initialProps: {
                initialCounter: 10
            }
        });
        act(() => result.current.increment())
        expect(result.current.counter).toBe(11);
     })

     test('should decrement value to 9', () => { 
        
        const { result } = renderHook(useCounter, {
            initialProps: {
                initialCounter: 10
            }
        });
        act(() => result.current.decrement());
        expect(result.current.counter).toBe(9)
      })
})