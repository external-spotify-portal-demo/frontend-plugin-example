import { createFormField } from '@backstage/plugin-scaffolder-react/alpha';
import {
  GithubOrgsField as Component,
  GithubOrgsFieldSchema,
  githubOrgsFieldValidation,
} from '../components/GithubOrgsField';

export const GithubOrgsField: any = createFormField({
  name: 'GithubOrgsField',
  component: Component,
  validation: githubOrgsFieldValidation,
  schema: GithubOrgsFieldSchema,
});
