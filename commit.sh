echo "Commit bundle.js or style.css? (y/n)"
read commitBundle

if [ "$commitBundle" = "y" ]; then
  git update-index --no-assume-unchanged src/main/resources/static/bundle.js
  git update-index --no-assume-unchanged src/main/resources/static/style.css
else
  git update-index --assume-unchanged src/main/resources/static/bundle.js
  git update-index --assume-unchanged src/main/resources/static/style.css
fi
git add -A
echo "Enter commit comment"
read comment
git commit -m "$comment"
git push
