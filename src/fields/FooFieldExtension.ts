import { createFormField } from '@backstage/plugin-scaffolder-react/alpha';
import {
  FooField as Component,
  FooFieldSchema,
  fooFieldValidation,
} from '../components/FooField';

export const FooField: any = createFormField({
  name: 'FooField',
  component: Component,
  validation: fooFieldValidation,
  schema: FooFieldSchema,
});
