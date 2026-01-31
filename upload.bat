@echo off
echo Initializing Git...

git init

echo Adding remote...
git remote remove origin 2>nul
git remote add origin https://github.com/Sahil1510-droid/Bansal-Constructions.git

echo Pulling from GitHub...
git pull origin main --allow-unrelated-histories

echo Adding all files...
git add .

echo Committing changes...
git commit -m "Full project upload"

echo Pushing to GitHub...
git push -u origin main

pause
