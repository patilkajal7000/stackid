import { useState } from 'react';

const useInput = (validateValue: any) => {
    const [enteredValue, setEnteredValue] = useState('');
    const [isTouched, setIsTouched] = useState(false);

    const valueIsValid = validateValue(enteredValue);
    const hasError = !valueIsValid && isTouched;

    const valueChangeHandler = (e: any) => {
        setEnteredValue(e);
    };

    const inputBlurHandler = () => {
        setIsTouched(true);
    };

    const reset = () => {
        setEnteredValue('');
        setIsTouched(false);
    };
    return {
        value: enteredValue,
        hasError,
        valueChangeHandler,
        inputBlurHandler,
        isValid: valueIsValid,
        reset,
        isTouched,
    };
};

export default useInput;
