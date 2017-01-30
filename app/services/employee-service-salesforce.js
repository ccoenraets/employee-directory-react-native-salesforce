import {net} from 'react-native-force';

let prettifyEmployee = (employee) => {
    let prettyEmployee = {
        id: employee.Id,
        firstName: employee.FirstName || undefined,
        lastName: employee.LastName || undefined,
        title: employee.Title || undefined,
        picture: employee.Picture__c || undefined,
        reports: []
    };
    if (employee.ReportsTo) {
        prettyEmployee.manager = {
            id: employee.ReportsTo.Id,
            firstName: employee.ReportsTo.FirstName,
            lastName: employee.ReportsTo.LastName,
            title: employee.ReportsTo.Title,
            picture: employee.ReportsTo.Picture__c
        };
    }
    return prettyEmployee;
};

export let findAll = () => new Promise((resolve, reject) => {
    let soql = 'SELECT Id, FirstName, LastName, Title, Picture__c FROM Contact WHERE Picture__c != null LIMIT 100';
    net.query(soql,
        (response) => {
            let records = response.records;
            let employees = records.map((employee) => prettifyEmployee(employee));
            resolve(employees);
        },
        (error) => {
            alert(error.message);
            reject(error);
        }
    );
});

export let findByName = (name) => new Promise((resolve, reject) => {
    let soql = `SELECT Id, FirstName, LastName, Title, Picture__c FROM Contact WHERE name LIKE '%${name}%' LIMIT 20`;
    net.query(soql,
        (response) => {
            let records = response.records;
            let employees = records.map((employee) => prettifyEmployee(employee));
            resolve(employees);
        },
        (error) => {
            alert(error.message);
            reject(error);
        }
    );
});

export let findById = (id) => new Promise((resolve, reject) => {
    console.log("1 " + id);
    let soql = "SELECT Id, FirstName, LastName, Title, Email, MobilePhone, Picture__c, reportsTo.Id, reportsTo.FirstName, reportsTo.LastName, reportsTo.Title, reportsTo.Picture__c " +
               "FROM Contact WHERE Id = '" + id + "'";
    net.query(soql,
        function(response) {
            if (response.records && response.records.length>0) {
                let employee = prettifyEmployee(response.records[0]);
                console.log("2 " + id);
                let soql = "SELECT Id, FirstName, LastName, Title, Picture__c FROM Contact WHERE ReportsTo.Id = '" + id + "'";
                net.query(soql,
                    (response) => {
                        if (response.records && response.records.length > 0) {
                            employee.reports = response.records.map((employee) => prettifyEmployee(employee));
                        }
                        resolve(employee);
                    },
                    (error) => {
                        reject(error);
                    });
            } else {
                reject({message: "record not found"});
            }
        },
        function(error) {
            alert(error.message);
            reject(error);
        }
    );
});