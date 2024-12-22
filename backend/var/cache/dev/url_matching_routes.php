<?php

/**
 * This file has been auto-generated
 * by the Symfony Routing Component.
 */

return [
    false, // $matchHost
    [ // $staticRoutes
        '/api/users' => [
            [['_route' => 'api_users', '_controller' => 'App\\Controller\\UserController::getUsers'], null, ['GET' => 0], null, false, false, null],
            [['_route' => 'app_user_register', '_controller' => 'App\\Controller\\UserController::register'], null, ['POST' => 0], null, false, false, null],
        ],
        '/api/login' => [[['_route' => 'api_login', '_controller' => 'App\\Controller\\UserController::login'], null, ['POST' => 0], null, false, false, null]],
        '/api/logout' => [[['_route' => 'api_logout', '_controller' => 'App\\Controller\\UserController::logout'], null, ['POST' => 0], null, false, false, null]],
    ],
    [ // $regexpList
        0 => '{^(?'
                .'|/_error/(\\d+)(?:\\.([^/]++))?(*:35)'
            .')/?$}sDu',
    ],
    [ // $dynamicRoutes
        35 => [
            [['_route' => '_preview_error', '_controller' => 'error_controller::preview', '_format' => 'html'], ['code', '_format'], null, null, false, true, null],
            [null, null, null, null, false, false, 0],
        ],
    ],
    null, // $checkCondition
];
