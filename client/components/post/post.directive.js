angular.module('cc')
.directive('myDraggable', ['$document', function($document) {
  return {
    link: function(scope, element, attr) {
      var startX = 0, startY = 0, 
          x = element.parent().offset().left,
          y = element.parent().offset().top;

      element.on('mousedown', function(event) {
        // Prevent default dragging of selected content
        event.preventDefault();
        startX = event.pageX - x;
        startY = event.pageY - y;
        $document.on('mousemove', mousemove);
        $document.on('mouseup', mouseup);
      });

      function mousemove(event) {
        y = event.pageY - startY;
        x = event.pageX - startX;
        element.parent().css({
          top: y + 'px',
          left:  x + 'px'
        });
      }

      function mouseup() {
        $document.off('mousemove', mousemove);
        $document.off('mouseup', mouseup);
      }
    }
  };
}])
  .directive('editControl', function(){
    return {
      link: function(scope, ele, attrs){
        angular.element(ele).delegate('a','click', function(){
          switch($(this).data('role')){
            case 'h1':
            case 'h2':
            case 'p': 
              document.execCommand('formatBlock', false, '<' + $(this).data('role') + '>');
              break;
            default:
              document.execCommand($(this).data('role'), false, null);
              break;
          }
        });
      }
    };
  })
  .directive('blurData', function(){
    return {
      restrict: 'A',
      link: function(scope, element, attrs){
        angular.element(element).bind('keyup',function(){
          element.next().val($(this).html());
        }); 
      }
    };
  });


















