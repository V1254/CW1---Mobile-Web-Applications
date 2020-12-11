This is the xml parser for Coursework 1 - Exercise 3.

# Installation


- In order to run the application you will need to install node js => https://nodejs.org/en/


- Once installed, ensure that node is in the system path by running the following two commands. 

Command1:
    npm -v


Command2:
    node -v


- Once you have verified that the two commands above work, open a terminal at the root of this folder(xml-parser) and run the following command to install the dependencies required

npm install

- If the above fails, try installing the node version specified under the Development Info

# Running the program.

- Place all xml files to test under the folder `xmls` - the example from the coursework has already been added for you.

- Once you have placed all xml files under this folder, simply run the following command to parse the xmls and transform them into json as required.

node index.js


## Notes:

- All parsed xml will be put under a folder called xmls-to-json which is already provided
- The program will continue to run and generate JSON files until it encounters a problem. If any problems do occur, please remove the file causing the issue and deduct points as required, Then rerun the program and repeat.


# Development Info

- Libraries => fs(built into node to read xml file contents), xml2js(to convert the xml into js data we can process and manipulate)
- npm -v => 6.14.4
- node -v => 12.16.2

