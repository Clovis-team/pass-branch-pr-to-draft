
# Pass all associated PR to draft

This actions can be called on "push" branch events.
It's gonna gather all opened PR's for the branch and pass them to draft.

```
- name: Pass all the associated open PR's to draft
  uses: Clovis-team/pass-branch-pr-to-draft@v1.0.0
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
```

## How to do a new release:

Change the code, then:
```
npm run all
git add -A; git commit -m ""; git push
```

On github, draft a new release