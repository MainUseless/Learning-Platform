cd /application
mvn clean install package
rm -rf /opt/jboss/wildfly/standalone/deployments/*
cp ./target/*.war /opt/jboss/wildfly/standalone/deployments/learn.war