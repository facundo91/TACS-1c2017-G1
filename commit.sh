git add -A
git add --force src/main/resources/static/style.css
git add --force src/main/resources/static/bundle.js
echo "Enter commit comment"
read comment
git commit -m '$comment'
git push
