package in.careersetu.identity.repository;

import in.careersetu.identity.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    @Query("SELECT u FROM User u WHERE u.email = :email AND u.deletedAt IS NULL")
    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.mobile = :mobile AND u.deletedAt IS NULL")
    Optional<User> findByMobile(String mobile);

    @Query("SELECT u FROM User u WHERE u.oidcProvider = :provider AND u.oidcSubject = :subject AND u.deletedAt IS NULL")
    Optional<User> findByOidcProviderAndSubject(String provider, String subject);

    @Query("SELECT COUNT(u) > 0 FROM User u WHERE u.email = :email AND u.deletedAt IS NULL")
    boolean existsByEmail(String email);
}
