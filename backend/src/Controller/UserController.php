<?php
namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityManagerInterface;

class UserController extends AbstractController
{
    #[Route('/api/users', name: 'api_users', methods: ['GET'])]
    public function getUsers(UserRepository $userRepository)
    {
        $users = $userRepository->findAll();

        $data = [];
        
        foreach ($users as $user) {
            $data[] = [
                'id' => $user->getId(),
                'name' => $user->getName(),
                'email' => $user->getEmail(),
                'created_at' => $user->getCreatedAt()->format('Y-m-d H:i:s'),
            ];
        }

        return new JsonResponse($data);
    }

    #[Route('/api/users', methods: ['POST'])]
    public function register(Request $request, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $entityManager, UserRepository $userRepository)
    {
        try {
            $data = json_decode($request->getContent(), true);

            if ($data === null) {
                return new JsonResponse(['message' => 'Requéte invalide.'], Response::HTTP_BAD_REQUEST);
            }

            $user = new User();
            $user->setName($data['name']);
            $user->setEmail($data['email']);
            $user->setCreatedAt(new \DateTimeImmutable());
            
            $existingUser = $userRepository->findOneBy(['email' => $data['email']]);
            if ($existingUser) {
                return new JsonResponse(['message' => 'Cet utilisateur existe déjà.'], Response::HTTP_CONFLICT);
            }
            
            if (empty($data['password'])) {
                return new JsonResponse(['message' => 'Mot de passe requis'], Response::HTTP_BAD_REQUEST);
            }

            $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
            $user->setPassword($hashedPassword);

            $entityManager->persist($user);
            $entityManager->flush();

            return new JsonResponse(['message' => 'Utilisateur créé avec succé'], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return new JsonResponse(['message' => 'Erreur serveur : ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(
        Request $request,
        UserRepository $userRepository,
        UserPasswordHasherInterface $passwordHasher,
        SessionInterface $session
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        
        if (!$data || !isset($data['email'], $data['password'])) {
            return new JsonResponse(['message' => 'Email et mot de passe requis.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $user = $userRepository->findOneBy(['email' => $data['email']]);
        if (!$user || !$passwordHasher->isPasswordValid($user, $data['password'])) {
            return new JsonResponse(['message' => 'Identifiants invalides.'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        // Sauvegarder les informations utilisateur dans la session
        $session->set('user', [
            'id' => $user->getId(),
            'name' => $user->getName(),
            'email' => $user->getEmail(),
        ]);

        return new JsonResponse(['message' => 'Connexion réussie.', 'user' => $session->get('user')], JsonResponse::HTTP_OK);
    }

    #[Route('/api/logout', name: 'api_logout', methods: ['POST'])]
    public function logout(SessionInterface $session): JsonResponse
    {
        $session->remove('user');

        return new JsonResponse(['message' => 'Déconnexion réussie.'], JsonResponse::HTTP_OK);
    }
}
