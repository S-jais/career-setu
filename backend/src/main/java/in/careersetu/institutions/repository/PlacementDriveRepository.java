package in.careersetu.institutions.repository;

import in.careersetu.institutions.entity.PlacementDrive;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PlacementDriveRepository extends JpaRepository<PlacementDrive, UUID> {
}
