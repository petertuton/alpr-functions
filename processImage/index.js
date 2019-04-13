module.exports = async function (context, eventGridEvent) {
  context.log(typeof eventGridEvent);
  context.log(eventGridEvent);

  // Call the OpenALPR API
  // TODO

  // Check for confidence based on a provided threshold via env vars
  let confidence = process.env.CONFIDENCE_THRESHOLD || 90;  // TODO: Set to the result from the API call
  let isDetected = (confidence_threshold >= confidence)   ;

  // Send confident processing results to the appropriate queue
  if (isDetected) {
      let message = eventGridEvent;
      context.log(message);   
      context.bindings.outputSaveImageDetailsQueue = message;
  } else {
      let message = eventGridEvent;
      context.log(message);   
      context.bindings.outputManuallyProcessImageQueue = message;
  }
  context.done();

  // Return the result
  return isDetected; 
};