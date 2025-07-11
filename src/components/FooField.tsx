import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import type { FieldValidation } from '@rjsf/utils';
import { makeFieldSchema } from '@backstage/plugin-scaffolder-react';
import React from 'react';

export const FooFieldSchema = makeFieldSchema({
  output: (z) => z.string(),
});

/*
 This is the actual component that will get rendered in the form
*/
export const FooField = (
  props: typeof FooFieldSchema.TProps,
) => {
  const { onChange, rawErrors, formData, required } = props;
  return (
    <FormControl
      margin='normal'
      required={required}
      error={rawErrors?.length > 0 && !formData}
    >
      <InputLabel htmlFor='validateName'>Name</InputLabel>
      <Input
        id='validateName'
        aria-describedby='entityName'
        onChange={(e) => onChange(e.target?.value)}
      />
      <FormHelperText id='entityName'>
        Use only letters, numbers, hyphens and underscores
      </FormHelperText>
    </FormControl>
  );
};

/*
 This is a validation function that will run when the form is submitted.
  You will get the value from the `onChange` handler before as the value here to make sure that the types are aligned\
*/
export const fooFieldValidation = (
  value: string,
  validation: FieldValidation
) => {
  const kebabCase = /^[a-z0-9-_]+$/g.test(value);

  if (kebabCase === false) {
    validation.addError(
      `Only use letters, numbers, hyphen ('-') and underscore ('_').`
    );
  }
};
