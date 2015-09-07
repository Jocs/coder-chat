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
  /*
  * onkeyupData指令用途：
  * 当元素监听到‘keyup’事件，就会把元素的innerHTML复制给作用域中的content。
  * 在定义指令中，scope属性可以设定三个值。
  * 1、scope：false 指令的作用域和父作用域是同一个作用域。
  * 2、scope：true 指令的scope 继承父作用域。是父作用域的一个字作用域。（类似闭包）
  * 3. scope:{
  *           property1: '@', //单向数据绑定
  *           property2: '=', //双向数据绑定
  *           property3: '&'  //引用‘父作用域’的方法
  *          }
  */
  .directive('onkeyupData', function(){
    return {
      restrict: 'A',
      scope: {
        content: '=postContent'
      },
      controller: function($scope, $element, $attrs){
        $element.bind('keyup',function(){
          $scope.content = $element.html();
          var warn_ele = $element.next().next();
          $element.html()? warn_ele.addClass('hidden'): warn_ele.removeClass('hidden');
        });
        
      }
    };
  });


















