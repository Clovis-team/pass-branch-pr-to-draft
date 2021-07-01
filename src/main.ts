import * as core from '@actions/core'
import * as github from '@actions/github'

const getAllOpenedPrIds = `query($repo: String!, $owner: String!, $headRef: String!) {
  repository(name: $repo, owner: $owner) {
    pullRequests(headRefName: $headRef, first: 100, states: OPEN) {
      nodes {
        id
      }
    }
  }
}`

const convertPrToDraft = `mutation ConvertToDraft($pullRequestId: String!) {
  convertPullRequestToDraft(input: {clientMutationId: "pass-branch-pr-to-draft-action", pullRequestId: $pullRequestId}) {
    pullRequest {
      isDraft
    }
  }
}`

async function run(): Promise<void> {
  try {
    const token = (core.getInput('github_token') ||
      process.env.GITHUB_TOKEN) as string

    const octokit = new github.GitHub(token)
    const context = github.context

    const repoName = context.payload.repository?.name
    const repoOwner = context.payload.repository?.owner.login
    // Remove refs/heads/ from the ref to retrieve only the name
    const headRefName = context.ref.slice(11)

    const opened_prs: any = await octokit.graphql(getAllOpenedPrIds, {
      owner: repoOwner,
      repo: repoName,
      headRef: headRefName
    })

    const openedPrsIds = opened_prs?.repository.pullRequests.nodes.map(
      (n: any) => n.id as string
    )

    for (const prId of openedPrsIds) {
      await octokit.graphql(convertPrToDraft, {
        pullRequestId: prId
      })
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
