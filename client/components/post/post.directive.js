angular.module('cc')
.directive('myDraggable', ['$document', function($document) {
  return {
    link: function(scope, element, attr) {
      var startX = 0, startY = 0, 
      //1030 = 1250 - 220 */* 1250是transform－origin最开始x的偏移。220是＃editor的left值。
          x = element.parent().offset().left-1030,
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
      restrict: 'A',
      scope: false,
      controller: function($scope, $element, $attrs){
        $element.delegate('a','click', function(){
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
          $scope.post.content = $('#editor').html();
        });
      }
    };
  })
  .directive('onkeyupData', function(){
    return {
      restrict: 'A',
      scope: false,
      controller: function($scope, $element, $attrs){
        $element.bind('keyup',function(){
          $scope.post.content = $element.html();
        });
      }
    };
  });


















