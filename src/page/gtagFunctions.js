function placeOrder(orderValue, currency, transactionID) {
    // Your code to process the order goes here...

    // Call the gtag function to trigger the conversion event
    window.gtag('event', 'conversion', {
      'send_to': 'AW-10800643804/E4uYCPae2skYENz9kp4o',
      'value': orderValue,
      'currency': currency,
      'transaction_id': transactionID
    });
}

export default placeOrder;

