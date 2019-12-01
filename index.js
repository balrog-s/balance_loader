const fs = require('fs');
const readline = require('readline');
const {processRequest} = require('./process');
const validation = require('./validators/validation');
var {sanitizeLoadAmountValue} = require('./utils/currency');

async function process() {
    const fileStream = fs.createReadStream('./data/input.txt');
    const logger = fs.createWriteStream('./data/generated_output.txt');
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    for await (const line of rl) {
        const lineToJSON = JSON.parse(line);
        const loadAttempt = {
            id: lineToJSON.id,
            customerId: lineToJSON.customer_id,
            loadAmount: sanitizeLoadAmountValue(lineToJSON.load_amount),
            time: lineToJSON.time
        }
        const idAlreadyProcessed = validation.isIDAlreadyProcessed(loadAttempt);
        const isPayloadInvalid = validation.isInvalidInitialAmount(loadAttempt);
        if (idAlreadyProcessed) {
            console.log(`Trx ID: ${loadAttempt.id} - Customer ID: ${loadAttempt.customerId} already stored. So skipping...`);
            continue;
        }
        else if (isPayloadInvalid) {
            logger.write(JSON.stringify({'id': loadAttempt.id, 'customer_id': loadAttempt.customerId, accepted: false}) + '\n');
        } else {
            const processResult = processRequest(loadAttempt);
            if (processResult === true) {
                logger.write(JSON.stringify({'id': loadAttempt.id, 'customer_id': loadAttempt.customerId, accepted: true}) + '\n');
            } else if (processResult === false) {
                logger.write(JSON.stringify({'id': loadAttempt.id, 'customer_id': loadAttempt.customerId, accepted: false}) + '\n');
            }
        }
    }
    logger.end();
}

process();
