<!doctype html>
<html ng-app="iserveu">
    <head>
        <title>IserveU</title>
        <meta name="viewport" content="initial-scale=1" />  
        <link rel="stylesheet" href="css/dependencies.css">
        <link rel="stylesheet" href="css/style.css">
        <link rel="icon shortcut" type="image/png" href="/img/symbol.png" />        
    </head>
    <body>
        <div ui-view="body" layout="rows" ng-controller="AppController"></div>
        <div ui-view="login"></div>
    </body>        
        <script src="/js/dependencies.js"></script>        
        <script src="/js/iserveu-app.js"></script>
        <script>
            angular.module("iserveu").constant("CSRF_TOKEN", '<?php echo csrf_token(); ?>');
        </script>  
</html> 
