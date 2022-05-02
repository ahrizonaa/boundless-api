git pull
git add .
git commit -m 'executed by .sh script'
git push

# https://cloud.google.com/sdk/gcloud/reference/app/deploy
gcloud app deploy ./app.yaml -q
gcloud app browse