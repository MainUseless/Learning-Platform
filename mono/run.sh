mvn clean package
rm -rf /opt/jboss/wildfly/standalone/deployments/*
cp ./target/*.war /opt/jboss/wildfly/standalone/deployments/learn.war