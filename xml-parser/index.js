const fs = require("fs");
const xml2js = require("xml2js");

/**
 * @function
 * @description - Transforms the parsed xml nodes to a readable array in the format requested for the coursework
 * @param {array} abstractMethods - The Abstract methods in a particular file and all their child nodes
 * @return {array} - the extracted data
 */
const transformNodes = (abstractMethods) => {
  if (!abstractMethods || !abstractMethods.length) {
    console.warn(`\ntransformAbstractMethodNodes, supplied no abstract methods exiting early`);
    return [];
  }

  return abstractMethods.map((method) => {
    // values we will use for the final object for this method as we parse
    let name, access_level, arguments, throws, returns;

    // extract the key nodes from this method
    const {
      $: methodAttributes,
      access_level: accessLevelNode,
      arguments: argumentsNode,
      return: returnNode,
      throws: throwsNode,
    } = method;

    // why name atrtibute would be empty is beyond me, but being careful here..
    if (methodAttributes) name = methodAttributes["name"];

    // acceess level could be empty
    if (accessLevelNode && accessLevelNode.length) {
      access_level = accessLevelNode[0];
    }

    // should always be present, but unsure of the xml files that will be used to test this
    if (returnNode && returnNode.length) returns = returnNode[0];

    // check if any arguments and parse correctly if there are
    if (argumentsNode && argumentsNode.length) {
      const parameterObject = argumentsNode[0];
      const { parameter: allParameters = [] } = parameterObject;

      //   transform the arguments into { type,value } pairs
      const mappedParameters = allParameters.map((param) => {
        let { _: parameterName = "", $: parameterTypeSelector = {} } = param;
        const { type = "" } = parameterTypeSelector;

        // workaround incase type on the parameter is not there
        if (!parameterName && typeof param === "string") {
          parameterName = param;
        }

        return { type: type, variable: parameterName };
      });

      // if only one parameter present, no need for an array so map it to the object form.
      arguments =
        mappedParameters.length === 1 ? { parameter: mappedParameters[0] } : mappedParameters;
    }

    // check if any eceptions and parse arcodinly
    if (throwsNode && throwsNode.length) {
      const throwsObject = throwsNode[0];
      const { exception } = throwsObject;
      throws = exception;
    }

    return { name, access_level, arguments, throws, return: returns };
  });
};

const parseXmls = () => {
  // read all the xml files present in xmls
  fs.readdir(`${__dirname}/xmls`, (_, allFileNames) => {
    allFileNames.forEach((fileName) => {
      // process each invidiual file
      fs.readFile(`${__dirname}/xmls/${fileName}`, (_, fileData) => {
        console.log(`\n=============================\n`);
        console.log(`Parsing file: ${fileName}`);

        let xmlParser = new xml2js.Parser();
        xmlParser.parseString(fileData, (err, parsedData) => {
          if (err || !parsedData)
            return console.log(
              `Unable to read file contents, cannot generate json. Parser Error (if applicable): ${JSON.stringify(
                err,
                null,
                4
              )}`
            );
          const { interface = {} } = parsedData;
          // store in an object with the root being "abstract_method"
          const result = {
            abstract_method: transformNodes(interface["abstract_method"]),
          };

          // stringify and add padding so the file looks nice :)
          const finalResult = JSON.stringify(result, null, 4);

          console.log(`\nExtracted Data: \n`, finalResult);

          const jsonFileName = `${fileName.slice(0, -4)}.json`; // replace .xml with .json in the filename

          console.log(`\nAdding Data to ${jsonFileName}`);

          fs.writeFileSync(`${__dirname}/xmls-to-json/${jsonFileName}`, finalResult);
          console.log(`\nFinished Parsing File: ${fileName} => Produced: ${jsonFileName}`);
        });

        console.log(`\n=============================\n`);
      });
    });
  });
};

parseXmls();

// console.log("%cHi my name is %s and i am %d years old", 'color:yellow', 'jack', 12)
