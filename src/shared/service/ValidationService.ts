// export const EmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
export const EmailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const PasswordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,32}$/;
export const LengthRegex = (from: number, to: number) => new RegExp(`^.{${from},${to}}$`);
export const MinLengthRegex = (minVal: number) => new RegExp(`^.{${minVal},}$`);
export const validateEmail = (value: string) => {
    if (value.trim() === '') return false;
    if (value.match(EmailRegex)) {
        return true;
    } else {
        return false;
    }
};

export const validatePassword = (value: string) => {
    if (value.trim() === '') return false;
    if (value.match(PasswordRegex)) {
        return true;
    } else {
        return false;
    }
};

export const emptyStringValidation = (value: string) => {
    return value.trim() !== '';
};

export const checkLengthValidation = (value: string, regex: RegExp) => {
    if (!emptyStringValidation(value)) return false;
    return value.trim().match(regex);
};

export const checkPasswordMatch = (value1: string, value2: string) => {
    if (value1.trim() === '') return false;
    if (value2.trim() === '') return false;
    if (value1 === value2) {
        return true;
    } else {
        return false;
    }
};
