mkdir -p logs
FILE="logs/deploy-`date --iso-8601=seconds`.log"
touch $FILE
echo "[`date --iso-8601=seconds`]: Logging" >> $FILE
cat src/main/resources/asciiart.txt
echo "Deploy front end? (y/n)"
read front

if [ "$front" = "y" ]; then
#Compiling the front-end
echo 'Deploying front end'
cd src/main/resources/static/
sudo npm install && gulp make
cd ../../../../
fi


echo "Deploy back end? (y/n)"
read back

if [ "$back" = "y" ]; then
#Install the project
echo 'Making project'
mvn clean install -DskipTests -P openshift
#Move the Web Archive File to the Tomcat root
echo 'Moving WAR to Tomcat root'
sudo cp webapps/*.war /opt/tomcat/webapps/
#Removing target folder
echo 'Removing target folder'
rm -rf target/
#Open the project main url (Could be too early)
echo 'Openning browser for you'
xdg-open http://localhost:8080/
#See logs
echo 'Showing Logs'
sudo less +F /opt/tomcat/logs/catalina.out
fi
