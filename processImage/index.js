const azure_servicebus = require('azure-sb');

module.exports = async function (context, eventGridEvent) {
  context.log(eventGridEvent);

  // Call the OpenALPR API
  // TODO
  let file = eventGridEvent.data.url;
  let confidence = 90;  // TODO: Set to the result from the API call
  context.log("File:",file);

  // Check for confidence based on a provided threshold
  const confidence_threshold = process.env.CONFIDENCE_THRESHOLD;
  let isDetected = (confidence >= confidence_threshold);
  context.log("confidence_threshold:",confidence_threshold);
  context.log("confidence:",confidence);
  context.log("isDetected:",isDetected);

  // Use direct code instead of output binding to send a message to the sb
  const message = {
    file
  };
  const sb = azure_servicebus.createServiceBusService(process.env.ALPR_SERVICEBUS_CONNECTION_STRING);

  // Send confident processing results to the appropriate queue
  if (isDetected) {
      context.log("Pushing file to exportimage queue");
      sb.sendQueueMessage("exportimage", message, function (err) {
        if (err) {
          context.log('Failed Tx: ', err);
        } else {
          context.log('Sent:' + message);
        }
      });
      // context.bindings.outputExportImageDetailsQueue = file;
  } else {
    context.log("Pushing file to manuallyprocess queue");
      // context.bindings.outputManuallyProcessImageQueue = file;
  }
  context.done();
};