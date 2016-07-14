*****************   INTERACTING WITH GIT PROPERLY   ********************


//add your files to YOUR REPO
git add .


//commit your files to YOUR REPO
git commit -m "Styled Message Here. Look At Style Guide on Slack"


//pull from ORG's REPO to make sure you're up to date
git pull --rebase upstream DEV

//fix merge conflicts (git add) after each merge resolution (git rebase --continue) to continue with rebase process

//make sure code still works

//push working code to YOUR REPO
git push origin master

//issue pull request from YOUR REPO MASTER BRANCH to ORG's REPO DEV BRANCH