type IValue = { value: string };

export const toEmail = ({ value }: IValue) => value?.toLowerCase();
