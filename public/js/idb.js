// create variable to hold db connection 
let db; 

// establish a connection to IndexedDB database called 'budget_tracker' and set it to version 1 
// change version number to 2 to trigger onupgradeneeded event
const request = indexedDB.open('budget_tracker', 1); 

// this event will emit if the database version changes (nonexistant to version 1, v1 to v2, etc.) 
request.onupgradeneeded = function(event) { 
    // save a reference to the database  
    const db = event.target.result; 
    // create an object store (table) called `new_transaction`, set it to have an auto incrementing primary key of sorts  
    db.createObjectStore('new_transaction', { autoIncrement: true }); 

}; 

// upon a successful  
request.onsuccess = function(event) { 
    // when db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection, save reference to db in global variable 
    db = event.target.result; 
  
    // check if app is online, if yes run uploadTransaction() function to send all local db data to api 
    if (navigator.onLine) { 
      // we haven't created this yet, but we will soon, so let's comment it out for now 
      // uploadTransaction(); 
    } 
}; 

 
request.onerror = function(event) { 
    // log error here 
    console.log(event.target.errorCode); 
}; 


// This function will be executed if we attempt to submit a new transaction and there's no internet connection 
// needs to be added to .catch method
function saveRecord(record) { 
    // open a new transaction with the database with read and write permissions  
    const transaction = db.transaction(['new_transaction'], 'readwrite'); 

    // access the object store for `new_transaction` 
    // transaction.objectStore helps indexedDB maintain accurate reading of data
    const transactionObjectStore = transaction.objectStore('new_transaction'); 

    // add record to your store with add method 
    transactionObjectStore.add(record); 
} 
