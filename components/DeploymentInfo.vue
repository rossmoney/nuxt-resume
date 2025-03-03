<template>
  <div class="text-gray-700 print:hidden text-center">
    <span v-if="isProduction" class="mr-2">
      Last deployed on {{ deployedTimestamp }} for commit
      <a :href="commitLink">{{ commitSha }}</a>
    </span>
    <span v-else class="mr-2">Running locally</span>
    <a class="mr-2" href="https://github.com/rossmoney/nuxt-resume/actions">
      <img
        class="inline h-5 -mt-1"
        :src="pipelineStatusUrl"
        alt="GitLab build status"
      />
    </a>
    <a
      href="https://github.com/rossmoney/nuxt-resume"
      class="inline-flex items-center"
    >
      View the source on GitHub
      <Icon class="ml-1" type="github" />
    </a>
  </div>
</template>

<script>
import moment from 'moment';
import Icon from './utility/Icon';

export default {
  components: { Icon },
  data: () => ({
    pipelineStatusUrl: '',
  }),
  created() {
    this.isProduction = process.env.isProduction;
    this.deployedTimestamp = moment(process.env.GITHUB_RUN_TIMESTAMP)
      .utc()
      .format('Y/MM/DD \\a\\t HH:mm:ss z');
    this.commitSha = process.env.GITHUB_SHA;
    this.commitLink = `https://github.com/${process.env.GITHUB_REPOSITORY}/commit/${this.commitSha}`;

    setInterval(this.refreshPipelineStatus, 5000);
    this.refreshPipelineStatus();
  },
  methods: {
    refreshPipelineStatus() {
      this.pipelineStatusUrl = `https://github.com/rossmoney/nuxt-resume/actions/workflows/CI.yml/badge.svg?branch=master&${Date.now()}`;
    },
  },
};
</script>
