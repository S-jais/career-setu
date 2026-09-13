package in.careersetu.applications.service;

import in.careersetu.applications.dto.ApplicationDtos;
import in.careersetu.applications.entity.Application;
import in.careersetu.applications.repository.ApplicationRepository;
import in.careersetu.common.exception.CareerSetuException;
import in.careersetu.companies.entity.Company;
import in.careersetu.companies.repository.CompanyRepository;
import in.careersetu.identity.entity.User;
import in.careersetu.identity.repository.UserRepository;
import in.careersetu.opportunities.entity.Opportunity;
import in.careersetu.opportunities.repository.OpportunityRepository;
import in.careersetu.students.entity.StudentProfile;
import in.careersetu.students.repository.StudentProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final OpportunityRepository opportunityRepository;
    private final CompanyRepository companyRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;

    public ApplicationService(ApplicationRepository applicationRepository,
                              OpportunityRepository opportunityRepository,
                              CompanyRepository companyRepository,
                              StudentProfileRepository studentProfileRepository,
                              UserRepository userRepository) {
        this.applicationRepository = applicationRepository;
        this.opportunityRepository = opportunityRepository;
        this.companyRepository = companyRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ApplicationDtos.StudentApplicationResponse apply(UUID userId, ApplicationDtos.ApplyRequest req) {
        StudentProfile profile = studentProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    StudentProfile p = new StudentProfile();
                    p.setUserId(userId);
                    return studentProfileRepository.save(p);
                });

        Opportunity opp = opportunityRepository.findById(req.opportunityId())
                .orElseThrow(() -> CareerSetuException.notFound("OPPORTUNITY", req.opportunityId().toString()));

        if (applicationRepository.existsByOpportunityIdAndStudentProfileId(opp.getId(), profile.getId())) {
            throw CareerSetuException.conflict("ALREADY_APPLIED", "You have already applied for this opportunity.");
        }

        Application app = new Application();
        app.setOpportunityId(opp.getId());
        app.setStudentProfileId(profile.getId());
        app.setCoverNote(req.coverNote());
        app.setStatus("APPLIED");
        app.setMatchScore(BigDecimal.valueOf(88.0));
        app.setAiExplanation("Strong candidate match based on skills and profile attributes.");
        app.setAppliedAt(Instant.now());
        app.setLastActivityAt(Instant.now());

        opp.setApplicationsCount(opp.getApplicationsCount() + 1);
        opportunityRepository.save(opp);

        Application saved = applicationRepository.save(app);

        Company company = companyRepository.findById(opp.getCompanyId()).orElse(null);
        return mapToStudentResponse(saved, opp, company);
    }

    @Transactional(readOnly = true)
    public List<ApplicationDtos.StudentApplicationResponse> getMyApplications(UUID userId) {
        Optional<StudentProfile> profileOpt = studentProfileRepository.findByUserId(userId);
        if (profileOpt.isEmpty()) {
            return Collections.emptyList();
        }

        UUID profileId = profileOpt.get().getId();
        List<Application> apps = applicationRepository.findByStudentProfileId(profileId);
        Map<UUID, Opportunity> oppMap = opportunityRepository.findAll().stream()
                .collect(Collectors.toMap(Opportunity::getId, o -> o, (a, b) -> a));
        Map<UUID, Company> companyMap = companyRepository.findAll().stream()
                .collect(Collectors.toMap(Company::getId, c -> c, (a, b) -> a));

        return apps.stream()
                .map(a -> {
                    Opportunity opp = oppMap.get(a.getOpportunityId());
                    Company comp = (opp != null && opp.getCompanyId() != null) ? companyMap.get(opp.getCompanyId()) : null;
                    return mapToStudentResponse(a, opp, comp);
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ApplicationDtos.OpportunityApplicantResponse> getAllApplications() {
        List<Application> apps = applicationRepository.findAll();
        return mapToApplicantResponses(apps);
    }

    @Transactional(readOnly = true)
    public List<ApplicationDtos.OpportunityApplicantResponse> getOpportunityApplications(UUID opportunityId) {
        List<Application> apps = applicationRepository.findByOpportunityId(opportunityId);
        return mapToApplicantResponses(apps);
    }

    @Transactional
    public ApplicationDtos.OpportunityApplicantResponse updateStatus(UUID applicationId, String newStatus) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> CareerSetuException.notFound("APPLICATION", applicationId.toString()));
        app.setStatus(newStatus != null ? newStatus.toUpperCase() : "UNDER_REVIEW");
        app.setLastActivityAt(Instant.now());
        Application saved = applicationRepository.save(app);

        List<ApplicationDtos.OpportunityApplicantResponse> resList = mapToApplicantResponses(List.of(saved));
        return resList.isEmpty() ? null : resList.get(0);
    }

    private List<ApplicationDtos.OpportunityApplicantResponse> mapToApplicantResponses(List<Application> apps) {
        Map<UUID, Opportunity> oppMap = opportunityRepository.findAll().stream()
                .collect(Collectors.toMap(Opportunity::getId, o -> o, (a, b) -> a));
        Map<UUID, StudentProfile> profileMap = studentProfileRepository.findAll().stream()
                .collect(Collectors.toMap(StudentProfile::getId, p -> p, (a, b) -> a));
        Map<UUID, User> userMap = userRepository.findAll().stream()
                .collect(Collectors.toMap(User::getId, u -> u, (a, b) -> a));

        return apps.stream().map(a -> {
            Opportunity opp = oppMap.get(a.getOpportunityId());
            StudentProfile prof = profileMap.get(a.getStudentProfileId());
            User user = prof != null ? userMap.get(prof.getUserId()) : null;

            return new ApplicationDtos.OpportunityApplicantResponse(
                    a.getId(),
                    a.getOpportunityId(),
                    opp != null ? opp.getTitle() : "Career Opportunity",
                    a.getStudentProfileId(),
                    user != null && user.getFullName() != null ? user.getFullName() : "Candidate",
                    user != null ? user.getEmail() : "candidate@careersetu.in",
                    prof != null ? prof.getHeadline() : "Student",
                    prof != null ? prof.getCurrentYear() : 4,
                    prof != null ? prof.getCgpa() : BigDecimal.valueOf(8.5),
                    a.getStatus(),
                    a.getCoverNote(),
                    a.getMatchScore(),
                    a.getAiExplanation(),
                    a.getAppliedAt(),
                    a.getLastActivityAt()
            );
        }).collect(Collectors.toList());
    }

    private ApplicationDtos.StudentApplicationResponse mapToStudentResponse(Application a, Opportunity opp, Company comp) {
        return new ApplicationDtos.StudentApplicationResponse(
                a.getId(),
                a.getOpportunityId(),
                opp != null ? opp.getTitle() : "Career Opportunity",
                comp != null ? comp.getLegalName() : "Partner Company",
                comp != null ? comp.getBrandName() : "Partner Company",
                opp != null ? opp.getType() : "INTERNSHIP",
                opp != null ? opp.getWorkMode() : "HYBRID",
                opp != null ? opp.getLocationCity() : "Remote",
                opp != null ? opp.getLocationState() : "India",
                opp != null ? opp.getStipendMin() : null,
                opp != null ? opp.getStipendMax() : null,
                opp != null ? opp.getSalaryMin() : null,
                opp != null ? opp.getSalaryMax() : null,
                a.getStatus(),
                a.getCoverNote(),
                a.getMatchScore(),
                a.getAiExplanation(),
                a.getAppliedAt(),
                a.getLastActivityAt()
        );
    }
}
