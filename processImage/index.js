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

  // Send confident processing results to the appropriate queue
  if (isDetected) {
      context.log("Pushing file to exportimage queue");
      context.bindings.outputExportImageDetailsQueue = file;
  } else {
    context.log("Pushing file to manuallyprocess queue");
      context.bindings.outputManuallyProcessImageQueue = file;
  }
  context.done();
};