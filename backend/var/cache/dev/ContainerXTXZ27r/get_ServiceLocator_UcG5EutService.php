<?php

namespace ContainerXTXZ27r;

use Symfony\Component\DependencyInjection\Argument\RewindableGenerator;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\DependencyInjection\Exception\RuntimeException;

/**
 * @internal This class has been auto-generated by the Symfony Dependency Injection Component.
 */
class get_ServiceLocator_UcG5EutService extends App_KernelDevDebugContainer
{
    /**
     * Gets the private '.service_locator.ucG5Eut' shared service.
     *
     * @return \Symfony\Component\DependencyInjection\ServiceLocator
     */
    public static function do($container, $lazyLoad = true)
    {
        return $container->privates['.service_locator.ucG5Eut'] = new \Symfony\Component\DependencyInjection\Argument\ServiceLocator($container->getService ??= $container->getService(...), [
            'kernel::registerContainerConfiguration' => ['privates', '.service_locator.zHyJIs5.kernel::registerContainerConfiguration()', 'get_ServiceLocator_ZHyJIs5_KernelregisterContainerConfigurationService', true],
            'App\\Kernel::registerContainerConfiguration' => ['privates', '.service_locator.zHyJIs5.kernel::registerContainerConfiguration()', 'get_ServiceLocator_ZHyJIs5_KernelregisterContainerConfigurationService', true],
            'kernel::loadRoutes' => ['privates', '.service_locator.zHyJIs5.kernel::loadRoutes()', 'get_ServiceLocator_ZHyJIs5_KernelloadRoutesService', true],
            'App\\Kernel::loadRoutes' => ['privates', '.service_locator.zHyJIs5.kernel::loadRoutes()', 'get_ServiceLocator_ZHyJIs5_KernelloadRoutesService', true],
            'App\\Controller\\UserController::getUsers' => ['privates', '.service_locator.OzEre6h.App\\Controller\\UserController::getUsers()', 'getUserControllergetUsersService', true],
            'App\\Controller\\UserController::updateUser' => ['privates', '.service_locator.OzEre6h.App\\Controller\\UserController::updateUser()', 'getUserControllerupdateUserService', true],
            'App\\Controller\\UserController::deleteUser' => ['privates', '.service_locator.OzEre6h.App\\Controller\\UserController::deleteUser()', 'getUserControllerdeleteUserService', true],
            'kernel:registerContainerConfiguration' => ['privates', '.service_locator.zHyJIs5.kernel::registerContainerConfiguration()', 'get_ServiceLocator_ZHyJIs5_KernelregisterContainerConfigurationService', true],
            'kernel:loadRoutes' => ['privates', '.service_locator.zHyJIs5.kernel::loadRoutes()', 'get_ServiceLocator_ZHyJIs5_KernelloadRoutesService', true],
            'App\\Controller\\UserController:getUsers' => ['privates', '.service_locator.OzEre6h.App\\Controller\\UserController::getUsers()', 'getUserControllergetUsersService', true],
            'App\\Controller\\UserController:updateUser' => ['privates', '.service_locator.OzEre6h.App\\Controller\\UserController::updateUser()', 'getUserControllerupdateUserService', true],
            'App\\Controller\\UserController:deleteUser' => ['privates', '.service_locator.OzEre6h.App\\Controller\\UserController::deleteUser()', 'getUserControllerdeleteUserService', true],
        ], [
            'kernel::registerContainerConfiguration' => '?',
            'App\\Kernel::registerContainerConfiguration' => '?',
            'kernel::loadRoutes' => '?',
            'App\\Kernel::loadRoutes' => '?',
            'App\\Controller\\UserController::getUsers' => '?',
            'App\\Controller\\UserController::updateUser' => '?',
            'App\\Controller\\UserController::deleteUser' => '?',
            'kernel:registerContainerConfiguration' => '?',
            'kernel:loadRoutes' => '?',
            'App\\Controller\\UserController:getUsers' => '?',
            'App\\Controller\\UserController:updateUser' => '?',
            'App\\Controller\\UserController:deleteUser' => '?',
        ]);
    }
}
