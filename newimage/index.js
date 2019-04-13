module.exports = async function (context, eventGridEvent) {
  context.log(typeof eventGridEvent);
  context.log(eventGridEvent);

  // Grab the file details from the event details 
  // TODO
  let message = eventGridEvent;

  // Push the details to the newimage queue
  context.log(message);   
  context.bindings.outputProcessImageQueue = message;
  context.done();
};