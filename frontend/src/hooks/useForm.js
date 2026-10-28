import { useState } from 'react';

// Reusable form hook: values, errors, onChange and a validated submit handler.
export default function useForm(initial, validate) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const handleSubmit = (onValid) => (e) => {
    e.preventDefault();
    const found = validate ? validate(values) : {};
    setErrors(found);
    if (Object.keys(found).length === 0) onValid(values);
  };

  const reset = () => {
    setValues(initial);
    setErrors({});
  };

  return { values, errors, onChange, handleSubmit, reset, setValues };
}
