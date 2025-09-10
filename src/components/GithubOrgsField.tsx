import React, { useState, useEffect } from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import type { FieldValidation } from '@rjsf/utils';
import { makeFieldSchema } from '@backstage/plugin-scaffolder-react';
import { useApi } from '@backstage/core-plugin-api';
import { scmIntegrationsApiRef, scmAuthApiRef } from '@backstage/integration-react';
import { Octokit } from '@octokit/rest';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
}));

export const GithubOrgsFieldSchema = makeFieldSchema({
  output: (z) => z.string(),
});

interface GitHubOrg {
  login: string;
  id: number;
  url: string;
  avatar_url?: string;
  description?: string | null;
  html_url?: string;
  name?: string;
}

/*
 This component fetches and displays GitHub organizations that the integration has access to
*/
export const GithubOrgsField = (
  props: typeof GithubOrgsFieldSchema.TProps,
) => {
  const { onChange, rawErrors, formData, required } = props;
  const classes = useStyles();
  const scmIntegrationsApi = useApi(scmIntegrationsApiRef);
  const scmAuthApi = useApi(scmAuthApiRef);
  
  const [orgs, setOrgs] = useState<GitHubOrg[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGitHubOrgs = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get GitHub integrations to determine the API base URL
        const integrations = scmIntegrationsApi.github.list();
        
        if (integrations.length === 0) {
          throw new Error('No GitHub integrations configured');
        }

        // Use the first available GitHub integration for configuration
        const integration = integrations[0];
        const baseUrl = integration.config.apiBaseUrl || 'https://api.github.com';
        const githubUrl = integration.config.host ? `https://${integration.config.host}` : 'https://github.com';
        
        // Get proper credentials using ScmAuthApi
        const credentials = await scmAuthApi.getCredentials({
          url: githubUrl,
        });

        if (!credentials.token) {
          throw new Error('No GitHub authentication token available');
        }
        
        // Initialize Octokit with the retrieved credentials
        const octokit = new Octokit({
          auth: credentials.token,
          baseUrl: baseUrl,
          userAgent: 'Backstage-Plugin',
        });

        // Fetch organizations from GitHub API using Octokit
        const { data } = await octokit.rest.orgs.listForAuthenticatedUser();
        setOrgs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch GitHub organizations');
        setOrgs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubOrgs();
  }, [scmIntegrationsApi, scmAuthApi]);

  if (loading) {
    return (
      <FormControl className={classes.formControl} margin="normal">
        <div className={classes.loading}>
          <CircularProgress size={20} />
          <span>Loading GitHub organizations...</span>
        </div>
      </FormControl>
    );
  }

  if (error) {
    return (
      <FormControl
        className={classes.formControl}
        margin="normal"
        error
      >
        <InputLabel htmlFor="github-orgs-error">GitHub Organizations</InputLabel>
        <FormHelperText>Error: {error}</FormHelperText>
      </FormControl>
    );
  }

  return (
    <FormControl
      className={classes.formControl}
      margin="normal"
      required={required}
      error={rawErrors?.length > 0 && !formData}
    >
      <InputLabel htmlFor="github-orgs-select">GitHub Organization</InputLabel>
      <Select
        id="github-orgs-select"
        value={formData || ''}
        onChange={(event) => onChange(event.target.value as string)}
        aria-describedby="github-orgs-helper"
      >
        <MenuItem value="">
          <em>Select an organization</em>
        </MenuItem>
        {orgs.map((org) => (
          <MenuItem key={org.id} value={org.login}>
            {org.login}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText id="github-orgs-helper">
        {orgs.length === 0 
          ? 'No organizations found or no access granted'
          : `Found ${orgs.length} organization${orgs.length !== 1 ? 's' : ''}`
        }
      </FormHelperText>
    </FormControl>
  );
};

/*
 This validation function ensures a GitHub organization is selected
*/
export const githubOrgsFieldValidation = (
  value: string,
  validation: FieldValidation
) => {
  if (!value || value.trim() === '') {
    validation.addError('Please select a GitHub organization');
  }
};
