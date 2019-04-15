module.exports = async function (context, eventGridEvent) {
  context.log(eventGridEvent);

  // Call the OpenALPR API
  // TODO
  context.log("File:",eventGridEvent.data.url);
  let file = eventGridEvent.data.url;

  // Check for confidence based on a provided threshold via env vars
  let confidence = 90;  // TODO: Set to the result from the API call
  let isDetected = (confidence >= process.env.CONFIDENCE_THRESHOLD);

  // Send confident processing results to the appropriate queue
  if (isDetected) {
      context.bindings.outputExportImageDetailsQueue = file;
  } else {
      context.bindings.outputManuallyProcessImageQueue = file;
  }
  context.done();
};