  
var processes = require('../../server/jelog/jserror.log')['process'];
console.log(protractor.Key)
describe('' , function () {

	it('should location to index', function() {
    browser.get('client/index.html');
  });

  describe('filter in this little DEMO ', function () {
  	beforeEach(function() {
  		browser.get('client/index.html');
  	});

    it('should test the click envent to order by name' , function () {
      while(processes.length) {
        var process = processes.shift();
        var ele = element(by.xpath(process.xpath));

        if(process.type == 'click'){
          ele.click();
        } else if(process.type == 'textModify') {

          if(process.position.startPosition == process.position.endPosition){
            var offset = process.fullValueLength - process.position.startPosition;
            for(var i = 0; i < offset ; i ++) ele.sendKeys(protractor.Key.LEFT);
              process.value? ele.sendKeys(process.value) : ele.sendKeys(protractor.Key.BACK_SPACE);

          } else {
            var offsetRight = process.fullValueLength - process.position.endPosition;
            var offsetLeft = process.fullValueLength - proces.position.startPosition;
            var valueLength = process.position.endPosition - process.position.startPosition;
            for(var i = 0; i < offsetRight ; i ++) ele.sendKeys(protractor.Key.LEFT);
            ele.sendKeys(protractor.Key.SHIFT);
            for(var i = 0; i < valueLength; i ++) ele.sendKeys(protractor.Key.LEFT);
            ele.sendKeys(protractor.Key.NULL);
            ele.sendKeys(protractor.Key.BACK_SPACE);
            if(process.value) ele.sendKeys(process.value);
          }
        }
      };

    // within a test:
    // browser.takeScreenshot().then(function (png) {
    //   writeScreenShot(png, 'exception.png');
    // });
});
});
});









