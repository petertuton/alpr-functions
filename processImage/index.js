const axios = require('axios');

module.exports = async function (context, eventGridEvent) {
  context.log(eventGridEvent);

  // Confirm this event is for a 'Microsoft.Storage.BlobCreated' event (in case the event is created with the Microsoft.Storage.BlobDeleted event)
  // if (eventGridEvent.eventType != "Microsoft.Storage.BlobCreated") return;

  // Call the OpenALPR API - just use the image_url function for now (with unauth access to the images container)
  const openalpr_baseurl = process.env.OPENALPR_URL;
  const openalpr_operation = "recognize_url";
  const openalpr_country = "country=us";
  const openalpr_key = "secret_key=" + process.env.OPENALPR_KEY;
  const openalpr_imageurl = "image_url=" + eventGridEvent.data.url;
  const openalpr_url = openalpr_baseurl + openalpr_operation + "?" + openalpr_country + "&" + openalpr_key + "&" + openalpr_imageurl;
  
  context.log("Attempting OpenALPR call:",openalpr_url);
  try {
    const response = await axios.post(openalpr_url);
    context.log(response);

    // Check for response code
    // TODO
    // if (response.status != 200) {}

    // Process the data
    const data = response.data;
    context.log(data);

    // Check for an error sent from OpenALPR
    // TODO: Do something about the error
    let error = data.error;

    // Proess the result
    let result = (data.results.length > 0) && data.results[0];
    let plate = result.plate;
    let confidence = result.confidence;
    let region = result.region;

    // Check for confidence based on a provided threshold
    // let isConfident = (confidence >= process.env.CONFIDENCE_THRESHOLD);
    let isConfident = true;
    context.log("confidence_threshold:",process.env.CONFIDENCE_THRESHOLD);
    context.log("confidence:",confidence);
    context.log("isConfident:",isConfident);
  
    // Create the message
    const message = {
      file: eventGridEvent.data.url,
      time: eventGridEvent.eventTime,
      plate,
      region,
      confidence
    };
  
    // Send processing results to the appropriate queue
    if (isConfident) {
      context.log("Pushing message to exportimage queue:",message);
      context.bindings.outputExportImageDetailsQueue = message;
    } else {
      context.log("Pushing message to manuallyprocess queue",message);
      context.bindings.outputManuallyProcessImageQueue = message;
    }

  } catch(error) {
    context.log(error);
    context.log("Pushing message to manuallyprocess queue",message);
    context.bindings.outputManuallyProcessImageQueue = message;

  } finally {
    context.done();
  }
};