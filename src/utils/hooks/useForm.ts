import { ChangeEvent, useState, useCallback } from 'react';

export function useForm<T extends { [key: string]: string }>(baseForm: T) {
  const [form, setForm] = useState<T>(baseForm);

  const handleChange = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) => {
      setForm((pastForm) => ({ ...pastForm, [target.name]: target.value }));
    },
    []
  );

  const setValue = useCallback((name: keyof T, value: string) => {
    setForm((pastForm) => ({ ...pastForm, [name]: value }));
  }, []);

  const resetForm = useCallback(
    (newForm?: T) => {
      setForm(newForm || baseForm);
    },
    [baseForm]
  );

  return [form, handleChange, { setValue, resetForm }] as const;
}
