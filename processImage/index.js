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

  // Create the message
  const message = {
    file
  };

  // Send processing results to the appropriate queue
  if (isDetected) {
    context.log("Pushing message to exportimage queue:",message);
    context.bindings.outputExportImageDetailsQueue = message;
  } else {
    context.log("Pushing message to manuallyprocess queue",message);
    context.bindings.outputManuallyProcessImageQueue = message;
  }
  context.done();
};