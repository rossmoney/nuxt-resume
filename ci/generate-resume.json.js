#!/usr/bin/env node
/* eslint-disable no-console */

const path = require('path');
const request = require('request-promise');
const _ = require('lodash');
const yargs = require('yargs');
const Ajv = require('ajv');
const removeMd = require('remove-markdown');

const resumeJson = _.cloneDeep(
  require(path.resolve(__dirname, '../resume-data.json')),
);

(async () => {
  const { githubPat, gitlabPat } = yargs
    .usage(
      'Usage: generate-resume.json.js --github-pat <pat> --gitlab-pat <pat>',
    )
    .alias('h', 'github-pat')
    .describe(
      'github-pat',
      'A GitHub PAT with "gist" scope. If not provided, the Gist will not be updated.',
    )
    .alias('l', 'gitlab-pat')
    .describe(
      'gitlab-pat',
      'A GitLab PAT with "api" scope. If not provided, the Snippet will not be updated.',
    ).argv;

  console.log('Transforming resume-data.json into a valid resume.json file...');
  delete resumeJson.basics.nameKerned;

  resumeJson.work = resumeJson.work.map(w => ({
    ...w,
    tags: undefined,
    type: undefined,
    summary: removeMd(w.summary),
    highlights: w.highlights ? w.highlights.map(h => removeMd(h)) : undefined,
  }));

  resumeJson.skills = resumeJson.skills.map(s => ({
    ...s,
    keywords: s.keywords
      ? s.keywords.map(k => (_.isString(k) ? k : k.display))
      : undefined,
  }));

  console.log('Validating JSON...');
  const errors = await validateResumeJson(resumeJson);
  if (!errors) {
    console.log('Resume.json is valid ✅');
  } else {
    console.log('Resume.json is not valid! ❌');
    console.log(errors);
  }

  const stringifiedResumeJson = JSON.stringify(resumeJson, null, 2);

  console.log('Transformed resume data into the following resume.json format:');
  console.log(stringifiedResumeJson);

  if (githubPat) {
    const gistId = '2d5585729373bcc933c34d8e5c28a0b2';
    console.log(
      `Updating the GitHub resume.json Gist (https://gist.github.com/rossmoney/${gistId})...`,
    );
    updateGitHubGist({ pat: githubPat, gistId, stringifiedResumeJson });
  } else {
    console.log(
      'No GitHub PAT was provided, so skipping the Gist update.',
      'You can provide a GitHub PAT using the --github-pat option.',
    );
  }

  if (gitlabPat) {
    const snippetId = '1948091';
    console.log(
      `Updating the GitLab resume.json Snippet (https://gitlab.com/snippets/${snippetId})...`,
    );
    updateGitLabSnippet({ pat: gitlabPat, snippetId, stringifiedResumeJson });
  } else {
    console.log(
      'No GitLab PAT was provided, so skipping the Snippet update.',
      'You can provide a GitLab PAT using the --gitlab-pat option.',
    );
  }
})();

/**
 * Validates the resume.json adheres to the JSON schema
 * @param {Object} resumeJson The resume.json data to validate
 * @returns An array of error objects, or null if the data is valid
 */
async function validateResumeJson(resumeJson) {
  const schema = await request.get({
    url:
      'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
    json: true,
    headers: { Accept: '*/*' },
  });

  // Options provided allow draft-04 schema support
  // See https://github.com/epoberezkin/ajv/releases/tag/5.0.0
  const ajv = new Ajv({
    schemaId: 'id',
    meta: false,
    extendRefs: true,
    unknownFormats: 'ignore',
    missingRefs: 'ignore',

    // removes any properties that aren't in the schema
    removeAdditional: true,
  });

  ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));

  const validate = await ajv.compile(schema);
  validate(resumeJson);
  return validate.errors;
}

const snippetGistDescription =
  'My resume.json: https://jsonresume.org/. This file is automatically generated by the CI pipeline of my Nuxt Résumé project: https://github.com/rossmoney/nuxt-resume#resumejson. View a rendered version of this data at https://registry.jsonresume.org/rossmoney.';

/**
 * Updates the GitLab resume.json Snippet
 * @param {Object} snippetInfo
 * @param {String} snippetInfo.pat A GitLab PAT with API scope
 * @param {String} snippetInfo.stringifiedResumeJson The contents of resume.json, stringified
 */
async function updateGitLabSnippet({ pat, snippetId, stringifiedResumeJson }) {
  await request.put({
    url: `https://gitlab.com/api/v4/snippets/${snippetId}`,
    json: true,
    body: {
      id: snippetId,
      title: 'resume.json',
      file_name: 'resume.json',
      description: snippetGistDescription,
      content: stringifiedResumeJson,
      visibility: 'public',
    },
    headers: {
      'PRIVATE-TOKEN': pat,
    },
  });
}

/**
 * Updates the GitHub resume.json Gist
 * @param {Object} snippetInfo
 * @param {String} snippetInfo.pat A GitHub PAT with Gist scope
 * @param {String} snippetInfo.stringifiedResumeJson The contents of resume.json, stringified
 */
async function updateGitHubGist({ pat, gistId, stringifiedResumeJson }) {
  await request.patch({
    url: `https://rossmoney:${pat}@api.github.com/gists/${gistId}`,
    json: true,
    body: {
      description: snippetGistDescription,
      files: {
        'resume.json': {
          content: stringifiedResumeJson,
        },
      },
    },
    headers: {
      'User-Agent': 'rossmoney',
    },
  });
}
