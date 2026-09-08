package in.careersetu.common.config;

import in.careersetu.applications.entity.Application;
import in.careersetu.applications.repository.ApplicationRepository;
import in.careersetu.companies.entity.Company;
import in.careersetu.companies.repository.CompanyRepository;
import in.careersetu.identity.entity.User;
import in.careersetu.identity.repository.UserRepository;
import in.careersetu.opportunities.entity.Opportunity;
import in.careersetu.opportunities.repository.OpportunityRepository;
import in.careersetu.events.entity.CampusEvent;
import in.careersetu.events.repository.CampusEventRepository;
import in.careersetu.interviews.entity.InterviewSchedule;
import in.careersetu.interviews.repository.InterviewRepository;
import in.careersetu.mentorship.entity.MentorProfile;
import in.careersetu.mentorship.repository.MentorProfileRepository;
import in.careersetu.messaging.entity.ChatMessage;
import in.careersetu.messaging.repository.ChatMessageRepository;
import in.careersetu.messaging.service.MessageService;
import in.careersetu.skills.entity.Skill;
import in.careersetu.skills.repository.SkillRepository;
import in.careersetu.students.entity.StudentProfile;
import in.careersetu.students.repository.StudentProfileRepository;
import in.careersetu.institutions.entity.InstitutionStudent;
import in.careersetu.institutions.entity.PlacementDrive;
import in.careersetu.institutions.repository.InstitutionStudentRepository;
import in.careersetu.institutions.repository.PlacementDriveRepository;
import in.careersetu.notifications.entity.AppNotification;
import in.careersetu.notifications.repository.NotificationRepository;
import in.careersetu.assessment.entity.AssessmentSubmission;
import in.careersetu.assessment.repository.AssessmentSubmissionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Automatically seeds initial demo users, student profile, companies, skills,
 * opportunities, and active applications for local dev.
 */
@Component
public class DevDataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DevDataSeeder.class);

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final CompanyRepository companyRepository;
    private final SkillRepository skillRepository;
    private final OpportunityRepository opportunityRepository;
    private final ApplicationRepository applicationRepository;
    private final MentorProfileRepository mentorProfileRepository;
    private final CampusEventRepository campusEventRepository;
    private final InterviewRepository interviewRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final InstitutionStudentRepository institutionStudentRepository;
    private final PlacementDriveRepository placementDriveRepository;
    private final NotificationRepository notificationRepository;
    private final AssessmentSubmissionRepository assessmentSubmissionRepository;
    private final PasswordEncoder passwordEncoder;

    public DevDataSeeder(UserRepository userRepository,
                         StudentProfileRepository studentProfileRepository,
                         CompanyRepository companyRepository,
                         SkillRepository skillRepository,
                         OpportunityRepository opportunityRepository,
                         ApplicationRepository applicationRepository,
                         MentorProfileRepository mentorProfileRepository,
                         CampusEventRepository campusEventRepository,
                         InterviewRepository interviewRepository,
                         ChatMessageRepository chatMessageRepository,
                         InstitutionStudentRepository institutionStudentRepository,
                         PlacementDriveRepository placementDriveRepository,
                         NotificationRepository notificationRepository,
                         AssessmentSubmissionRepository assessmentSubmissionRepository,
                         PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.companyRepository = companyRepository;
        this.skillRepository = skillRepository;
        this.opportunityRepository = opportunityRepository;
        this.applicationRepository = applicationRepository;
        this.mentorProfileRepository = mentorProfileRepository;
        this.campusEventRepository = campusEventRepository;
        this.interviewRepository = interviewRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.institutionStudentRepository = institutionStudentRepository;
        this.placementDriveRepository = placementDriveRepository;
        this.notificationRepository = notificationRepository;
        this.assessmentSubmissionRepository = assessmentSubmissionRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 3) {
            log.info("Database already seeded with {} users. Skipping remaining DevDataSeeder.", userRepository.count());
            return;
        }

        log.info("Seeding demo data for CareerSetu development environment...");

        String defaultPasswordHash = passwordEncoder.encode("Demo@CareerSetu2024");

        // 1. Seed Demo Users
        User student = User.builder()
                .email("student@careersetu.in")
                .fullName("Aarav Sharma")
                .displayName("Aarav")
                .passwordHash(defaultPasswordHash)
                .primaryRole(User.UserRole.STUDENT)
                .accountStatus(User.AccountStatus.ACTIVE)
                .emailVerified(true)
                .mobileVerified(true)
                .build();
        student = userRepository.save(student);

        User employer = User.builder()
                .email("employer@careersetu.in")
                .fullName("Priya Patel")
                .displayName("Priya (TechCorp)")
                .passwordHash(defaultPasswordHash)
                .primaryRole(User.UserRole.EMPLOYER)
                .accountStatus(User.AccountStatus.ACTIVE)
                .emailVerified(true)
                .mobileVerified(true)
                .build();
        employer = userRepository.save(employer);

        User admin = User.builder()
                .email("admin@careersetu.in")
                .fullName("System Administrator")
                .displayName("Admin")
                .passwordHash(defaultPasswordHash)
                .primaryRole(User.UserRole.PLATFORM_ADMIN)
                .accountStatus(User.AccountStatus.ACTIVE)
                .emailVerified(true)
                .mobileVerified(true)
                .build();
        admin = userRepository.save(admin);

        // 2. Seed Student Profile
        StudentProfile studentProfile = new StudentProfile();
        studentProfile.setUserId(student.getId());
        studentProfile.setHeadline("Aspiring Full Stack & AI Systems Engineer");
        studentProfile.setBio("Computer Science undergraduate passionate about distributed systems, React, and generative AI platforms.");
        studentProfile.setCurrentYear(4);
        studentProfile.setCurrentSemester(7);
        studentProfile.setCgpa(BigDecimal.valueOf(8.75));
        studentProfile.setGraduationYear(2026);
        studentProfile.setEnrollmentNumber("CS2022-7891");
        studentProfile.setRollNumber("22CSE041");
        studentProfile.setLinkedinUrl("https://linkedin.com/in/aarav-sharma-demo");
        studentProfile.setGithubUrl("https://github.com/aaravsharma-dev");
        studentProfile.setPortfolioUrl("https://aaravsharma.dev");
        studentProfile.setProfileCompletionPct(92);
        studentProfile.setIsActivelyLooking(true);
        studentProfile = studentProfileRepository.save(studentProfile);

        // 3. Seed Demo Companies
        Company techCorp = new Company();
        techCorp.setLegalName("TechCorp India Private Limited");
        techCorp.setBrandName("TechCorp India");
        techCorp.setCompanyType("STARTUP");
        techCorp.setIndustry("Information Technology");
        techCorp.setHeadquartersCity("Bengaluru");
        techCorp.setHeadquartersState("Karnataka");
        techCorp.setVerificationStatus("APPROVED");
        techCorp.setIsActive(true);
        techCorp.setIsStartup(true);
        techCorp = companyRepository.save(techCorp);

        Company innovateSoft = new Company();
        innovateSoft.setLegalName("InnovateSoft Solutions Pvt Ltd");
        innovateSoft.setBrandName("InnovateSoft");
        innovateSoft.setCompanyType("SME");
        innovateSoft.setIndustry("Software Engineering");
        innovateSoft.setHeadquartersCity("Hyderabad");
        innovateSoft.setHeadquartersState("Telangana");
        innovateSoft.setVerificationStatus("APPROVED");
        innovateSoft.setIsActive(true);
        innovateSoft = companyRepository.save(innovateSoft);

        // 4. Seed Demo Skills
        List<Skill> skills = List.of(
                new Skill(null, "Java", "java", "Modern enterprise Java & Spring Boot", "HIGH", true, false, true),
                new Skill(null, "Python", "python", "Python for AI/ML & Data Engineering", "HIGH", true, false, true),
                new Skill(null, "React", "react", "React 19, TypeScript & Modern Frontend", "HIGH", true, false, true),
                new Skill(null, "Spring Boot", "spring-boot", "Microservices & Distributed Systems", "HIGH", true, false, true),
                new Skill(null, "FastAPI", "fastapi", "High-performance Python asynchronous APIs", "MEDIUM", true, false, true),
                new Skill(null, "PostgreSQL", "postgresql", "Relational database design and optimization", "HIGH", true, false, true),
                new Skill(null, "Machine Learning", "machine-learning", "Scikit-Learn, PyTorch and LLMs", "HIGH", true, false, true),
                new Skill(null, "Problem Solving", "problem-solving", "Algorithmic thinking and data structures", "HIGH", false, true, true)
        );
        skillRepository.saveAll(skills);

        // 5. Seed Opportunities
        Opportunity opp1 = new Opportunity();
        opp1.setCompanyId(techCorp.getId());
        opp1.setPostedBy(employer.getId());
        opp1.setTitle("Full Stack AI Software Engineer Intern");
        opp1.setSlug("full-stack-ai-engineer-intern");
        opp1.setType("INTERNSHIP");
        opp1.setDescription("Build next-generation talent discovery tools with React, FastAPI, and Spring Boot.");
        opp1.setLocationCity("Bengaluru");
        opp1.setLocationState("Karnataka");
        opp1.setWorkMode("HYBRID");
        opp1.setIsPaid(true);
        opp1.setStipendMin(35000);
        opp1.setStipendMax(50000);
        opp1.setDurationWeeks(24);
        opp1.setStatus("PUBLISHED");
        opp1.setApplicationsCount(9);
        opp1.setApplicationDeadline(LocalDate.now().plusMonths(2));
        opp1 = opportunityRepository.save(opp1);

        Opportunity opp2 = new Opportunity();
        opp2.setCompanyId(innovateSoft.getId());
        opp2.setPostedBy(employer.getId());
        opp2.setTitle("Junior Cloud & Backend Engineer");
        opp2.setSlug("junior-cloud-backend-engineer");
        opp2.setType("FULL_TIME");
        opp2.setDescription("Design resilient microservices, distributed cache architectures, and REST APIs.");
        opp2.setLocationCity("Hyderabad");
        opp2.setLocationState("Telangana");
        opp2.setWorkMode("REMOTE");
        opp2.setIsPaid(true);
        opp2.setSalaryMin(800000);
        opp2.setSalaryMax(1200000);
        opp2.setStatus("PUBLISHED");
        opp2.setApplicationsCount(14);
        opp2.setApplicationDeadline(LocalDate.now().plusMonths(1));
        opp2 = opportunityRepository.save(opp2);

        // 6. Seed Initial Demo Applications for Recruiter ATS
        Application demoApp1 = new Application();
        demoApp1.setOpportunityId(opp1.getId());
        demoApp1.setStudentProfileId(studentProfile.getId());
        demoApp1.setCoverNote("Passionate about building scalable AI workflows with modern web technologies.");
        demoApp1.setStatus("INTERVIEW");
        demoApp1.setMatchScore(BigDecimal.valueOf(92.0));
        demoApp1.setAiExplanation("92% compatibility: Candidate demonstrates verified skills in Java, React, and Python.");
        demoApp1.setAppliedAt(Instant.now().minusSeconds(86400 * 2));
        demoApp1.setLastActivityAt(Instant.now().minusSeconds(3600 * 4));
        applicationRepository.save(demoApp1);

        // Candidate 2: Priya Sharma
        User priya = User.builder()
                .email("priya.sharma@careersetu.in")
                .fullName("Priya Sharma")
                .displayName("Priya")
                .passwordHash(defaultPasswordHash)
                .primaryRole(User.UserRole.STUDENT)
                .accountStatus(User.AccountStatus.ACTIVE)
                .emailVerified(true)
                .build();
        priya = userRepository.save(priya);
        StudentProfile priyaProfile = new StudentProfile();
        priyaProfile.setUserId(priya.getId());
        priyaProfile.setHeadline("Backend Engineer & Distributed Systems Enthusiast");
        priyaProfile.setCurrentYear(4);
        priyaProfile.setCgpa(BigDecimal.valueOf(8.90));
        priyaProfile.setProfileCompletionPct(95);
        priyaProfile = studentProfileRepository.save(priyaProfile);

        Application demoApp2 = new Application();
        demoApp2.setOpportunityId(opp1.getId());
        demoApp2.setStudentProfileId(priyaProfile.getId());
        demoApp2.setCoverNote("Excited to apply my experience in Spring Boot and enterprise systems to AI tooling.");
        demoApp2.setStatus("SHORTLISTED");
        demoApp2.setMatchScore(BigDecimal.valueOf(88.0));
        demoApp2.setAiExplanation("88% compatibility: Verified expertise in Java, REST APIs, and database indexing.");
        demoApp2.setAppliedAt(Instant.now().minusSeconds(86400 * 3));
        demoApp2.setLastActivityAt(Instant.now().minusSeconds(3600 * 12));
        applicationRepository.save(demoApp2);

        // Candidate 3: Rahul Kumar
        User rahul = User.builder()
                .email("rahul.kumar@careersetu.in")
                .fullName("Rahul Kumar")
                .displayName("Rahul")
                .passwordHash(defaultPasswordHash)
                .primaryRole(User.UserRole.STUDENT)
                .accountStatus(User.AccountStatus.ACTIVE)
                .emailVerified(true)
                .build();
        rahul = userRepository.save(rahul);
        StudentProfile rahulProfile = new StudentProfile();
        rahulProfile.setUserId(rahul.getId());
        rahulProfile.setHeadline("Cloud DevOps & Microservices Architect");
        rahulProfile.setCurrentYear(4);
        rahulProfile.setCgpa(BigDecimal.valueOf(9.10));
        rahulProfile.setProfileCompletionPct(98);
        rahulProfile = studentProfileRepository.save(rahulProfile);

        Application demoApp3 = new Application();
        demoApp3.setOpportunityId(opp2.getId());
        demoApp3.setStudentProfileId(rahulProfile.getId());
        demoApp3.setCoverNote("Built high throughput resilient event pipelines and looking forward to scaling microservices.");
        demoApp3.setStatus("OFFERED");
        demoApp3.setMatchScore(BigDecimal.valueOf(96.0));
        demoApp3.setAiExplanation("96% compatibility: Outstanding performance in system architecture and cloud fundamentals.");
        demoApp3.setAppliedAt(Instant.now().minusSeconds(86400 * 5));
        demoApp3.setLastActivityAt(Instant.now().minusSeconds(3600 * 1));
        applicationRepository.save(demoApp3);

        // Candidate 4: Anita Singh
        User anita = User.builder()
                .email("anita.singh@careersetu.in")
                .fullName("Anita Singh")
                .displayName("Anita")
                .passwordHash(defaultPasswordHash)
                .primaryRole(User.UserRole.STUDENT)
                .accountStatus(User.AccountStatus.ACTIVE)
                .emailVerified(true)
                .build();
        anita = userRepository.save(anita);
        StudentProfile anitaProfile = new StudentProfile();
        anitaProfile.setUserId(anita.getId());
        anitaProfile.setHeadline("Data Scientist & Full Stack ML Developer");
        anitaProfile.setCurrentYear(3);
        anitaProfile.setCgpa(BigDecimal.valueOf(8.45));
        anitaProfile.setProfileCompletionPct(88);
        anitaProfile = studentProfileRepository.save(anitaProfile);

        Application demoApp4 = new Application();
        demoApp4.setOpportunityId(opp1.getId());
        demoApp4.setStudentProfileId(anitaProfile.getId());
        demoApp4.setCoverNote("Enthusiastic about integrating machine learning pipelines with production APIs.");
        demoApp4.setStatus("UNDER_REVIEW");
        demoApp4.setMatchScore(BigDecimal.valueOf(81.0));
        demoApp4.setAiExplanation("81% compatibility: Solid foundation in Python, data modeling, and REST integrations.");
        demoApp4.setAppliedAt(Instant.now().minusSeconds(86400 * 1));
        demoApp4.setLastActivityAt(Instant.now().minusSeconds(3600 * 6));
        applicationRepository.save(demoApp4);

        // ─────────────────────────────────────────────────────────────
        // Seed Mentors
        // ─────────────────────────────────────────────────────────────
        MentorProfile mentor1 = new MentorProfile(
                null, "Dr. Rohan Mehra", "Staff Software Architect", "Google Cloud", 12,
                4.98, 310, "RM", "from-blue-600 to-indigo-600",
                "Distributed Systems, Java, Cloud Native, System Design",
                "Leading distributed storage architectures at Google Cloud. Passionate about helping university students master large-scale distributed systems and interview algorithms.",
                "Tomorrow, 4:00 PM IST", "English, Hindi", 0, true
        );
        MentorProfile mentor2 = new MentorProfile(
                null, "Ananya Deshmukh", "Principal GenAI Researcher", "Microsoft AI", 9,
                4.95, 245, "AD", "from-purple-600 to-pink-600",
                "GenAI, LLM Fine-tuning, Python, FastAPI, RAG",
                "Specializing in fine-tuning open weights models and building low-latency RAG pipelines. Former IIT Bombay alumni mentor for graduate engineers.",
                "Wednesday, 6:30 PM IST", "English, Marathi, Hindi", 0, true
        );
        MentorProfile mentor3 = new MentorProfile(
                null, "Karthik Subramanian", "Director of Engineering", "Razorpay", 14,
                4.99, 420, "KS", "from-emerald-600 to-teal-600",
                "FinTech, Scalability, Spring Boot, Microservices",
                "Architecting resilient multi-bank payment switching infrastructure with 99.999% uptime. Mentoring students on clean architecture and high-throughput systems.",
                "Thursday, 5:00 PM IST", "English, Tamil, Hindi", 0, true
        );
        mentorProfileRepository.saveAll(List.of(mentor1, mentor2, mentor3));

        // ─────────────────────────────────────────────────────────────
        // Seed Campus Events & Hackathons
        // ─────────────────────────────────────────────────────────────
        CampusEvent event1 = new CampusEvent(
                null, "National GenAI & Agentic Systems Hackathon 2026", "CareerSetu & Google Cloud",
                "HACKATHON", "HYBRID", "Pune & Virtual Stream",
                "March 28, 2026", "March 30, 2026", "March 22, 2026", "₹5,00,000 + Fast-Track PPIs",
                420, 4, "Generative AI, RAG, FastAPI, Cloud",
                "36-hour flagship hackathon building India-scale public infrastructure and autonomous agents solving agriculture, healthcare, and education bottlenecks.",
                "₹5,00,000 Prize Pool;Direct Interview Shortlists for Finalists;Google Cloud Credits ($500/team);Verifiable National Hackathon Badge",
                true
        );
        CampusEvent event2 = new CampusEvent(
                null, "Razorpay FinTech 48-Hour Hiring Sprint", "Razorpay Engineering",
                "HIRING_SPRINT", "ONLINE", "Virtual Proctored Platform",
                "April 5, 2026", "April 7, 2026", "April 2, 2026", "₹3,00,000 + 15 Internship Offers",
                680, 2, "FinTech, Distributed Systems, Java, Go",
                "Rapid hiring contest solving real-time payment reconciliation and idempotent transactions with direct internship job offers for top 15 performers.",
                "15 Direct Summer Internship Offers;₹3,00,000 Cash Pool;Interview Fast-Track for Top 100",
                true
        );
        CampusEvent event3 = new CampusEvent(
                null, "Cloud Native Microservices Masterclass", "AWS User Group India",
                "WORKSHOP", "ONLINE", "Live Streaming",
                "April 18, 2026", "April 19, 2026", "April 15, 2026", "Free Certificate + Cloud Badges",
                950, 1, "DevOps, Kubernetes, Docker, Spring Boot",
                "Hands-on architectural workshop on container orchestration, service meshes, and resilient event-driven architectures with Spring Boot 3 & Docker.",
                "Hands-on AWS Cloud Sandbox Access;Verifiable Workshop Completion Certificate;Free Architecture E-Book",
                true
        );
        campusEventRepository.saveAll(List.of(event1, event2, event3));

        // ─────────────────────────────────────────────────────────────
        // Seed Interviews
        // ─────────────────────────────────────────────────────────────
        InterviewSchedule int1 = new InterviewSchedule(
                null, student.getId(), "Aarav Sharma", "student@careersetu.in",
                employer.getId(), "Deepak Patel (Lead Cloud Architect)", "TechCorp India",
                "Cloud Native Engineer Intern", "TECHNICAL_1", "Thursday, Mar 12, 2026",
                "03:00 PM - 03:45 PM", Instant.now().plusSeconds(86400 * 3), 45,
                "https://meet.google.com/xyz-cs-aarav", "SCHEDULED",
                "Focus on Spring Boot 3 virtual threads and PostgreSQL query execution plans.", null
        );
        InterviewSchedule int2 = new InterviewSchedule(
                null, priya.getId(), "Priya Sharma", "priya.sharma@careersetu.in",
                employer.getId(), "Dr. Neha Rao (Director of AI)", "TechCorp India",
                "AI/ML Researcher Intern", "SYSTEM_DESIGN", "Today",
                "04:30 PM - 05:15 PM", Instant.now().plusSeconds(3600), 45,
                "https://meet.google.com/xyz-cs-priya", "IN_PROGRESS",
                "Discuss vector database indexing and RAG chunking trade-offs.", null
        );
        InterviewSchedule int3 = new InterviewSchedule(
                null, rahul.getId(), "Rahul Kumar", "rahul.k@careersetu.in",
                employer.getId(), "Sarah Jenkins (Talent Acquisition)", "TechCorp India",
                "Full Stack Developer", "BEHAVIORAL", "Yesterday",
                "11:00 AM - 11:30 AM", Instant.now().minusSeconds(86400), 30,
                "https://meet.google.com/xyz-cs-rahul", "COMPLETED",
                "Candidate demonstrated strong collaborative mindset, technical clarity, and agile team practices.", 92
        );
        interviewRepository.saveAll(List.of(int1, int2, int3));

        // ─────────────────────────────────────────────────────────────
        // Seed Chat Messages
        // ─────────────────────────────────────────────────────────────
        String recruiterConvId = MessageService.generateConversationId(employer.getId(), student.getId());
        ChatMessage msg1 = new ChatMessage(
                null, recruiterConvId, employer.getId(), "Sarah Jenkins", "RECRUITER",
                student.getId(), "Aarav Sharma",
                "Hi Aarav! We reviewed your Career Passport application for the Cloud Native Engineer Intern role.",
                Instant.now().minusSeconds(3600 * 4), true
        );
        ChatMessage msg2 = new ChatMessage(
                null, recruiterConvId, employer.getId(), "Sarah Jenkins", "RECRUITER",
                student.getId(), "Aarav Sharma",
                "Your 96/100 code assessment score in Java & Spring Boot caught our hiring team's attention.",
                Instant.now().minusSeconds(3600 * 3), true
        );
        ChatMessage msg3 = new ChatMessage(
                null, recruiterConvId, student.getId(), "Aarav Sharma", "STUDENT",
                employer.getId(), "Sarah Jenkins",
                "Hello Sarah! Thank you for the update. I would love to discuss the opportunity and how my skills align with the team.",
                Instant.now().minusSeconds(3600 * 2), true
        );
        ChatMessage msg4 = new ChatMessage(
                null, recruiterConvId, employer.getId(), "Sarah Jenkins", "RECRUITER",
                student.getId(), "Aarav Sharma",
                "Would you be available for a 45-minute technical conversation this Thursday at 3:00 PM?",
                Instant.now().minusSeconds(1800), false
        );
        chatMessageRepository.saveAll(List.of(msg1, msg2, msg3, msg4));

        // ─────────────────────────────────────────────────────────────
        // Seed Institution Students (TPO Directory)
        // ─────────────────────────────────────────────────────────────
        InstitutionStudent is1 = new InstitutionStudent(
                "Aarav Sharma", "student@careersetu.in", "22CSE041",
                "Computer Science & Engineering", 4, 8.92, 14, "COMPLIANT", 4,
                "SHORTLISTED", "TechCorp India", 18.5
        );
        InstitutionStudent is2 = new InstitutionStudent(
                "Priya Sharma", "priya.sharma@careersetu.in", "22CSE018",
                "Computer Science & Engineering", 4, 9.15, 14, "COMPLIANT", 5,
                "INTERVIEW_SCHEDULED", "Microsoft AI", 24.0
        );
        InstitutionStudent is3 = new InstitutionStudent(
                "Rahul Kumar", "rahul.k@careersetu.in", "22IT052",
                "Information Technology", 4, 7.85, 10, "IN_PROGRESS", 2,
                "APPLIED", null, null
        );
        InstitutionStudent is4 = new InstitutionStudent(
                "Ananya Patel", "ananya.p@careersetu.in", "22AI009",
                "Artificial Intelligence & Data Science", 4, 9.42, 14, "COMPLIANT", 6,
                "PLACED", "Google DeepMind", 32.0
        );
        InstitutionStudent is5 = new InstitutionStudent(
                "Rohan Verma", "rohan.v@careersetu.in", "22ECE033",
                "Electronics & Communication", 4, 7.20, 6, "IN_PROGRESS", 1,
                "NOT_APPLIED", null, null
        );
        institutionStudentRepository.saveAll(List.of(is1, is2, is3, is4, is5));

        // ─────────────────────────────────────────────────────────────
        // Seed Campus Placement Drives
        // ─────────────────────────────────────────────────────────────
        PlacementDrive d1 = new PlacementDrive(
                "TechCorp India", "Cloud Native & Distributed Systems Engineer",
                "₹18.5 - ₹24.0 LPA", "₹65,000/month", 8.0, "CSE, IT, AI & DS",
                "March 18, 2026", "Online Coding Sandbox, System Architecture, Technical Panel, HR Discussion",
                "IN_PROGRESS", 148, 12
        );
        PlacementDrive d2 = new PlacementDrive(
                "Razorpay", "Software Development Engineer - Payments",
                "₹22.0 - ₹28.0 LPA", "₹85,000/month", 8.25, "CSE, IT",
                "March 25, 2026", "Algorithmic Assessment, System Design Round, Culture Fit",
                "UPCOMING", 210, 0
        );
        PlacementDrive d3 = new PlacementDrive(
                "Infosys AI Systems", "Specialist Programmer (GenAI & Cloud)",
                "₹9.5 - ₹12.0 LPA", "₹40,000/month", 7.0, "All Engineering Branches",
                "April 02, 2026", "Aptitude & Coding Round, Technical Panel Interview",
                "UPCOMING", 380, 0
        );
        PlacementDrive d4 = new PlacementDrive(
                "Microsoft India", "Support & Cloud Solution Architect",
                "₹26.0 - ₹34.0 LPA", "₹1,00,000/month", 8.5, "CSE, IT",
                "February 20, 2026", "Coding Sandbox, Cloud Design Panel, Senior Leadership Round",
                "OFFERS_RELEASED", 285, 18
        );
        placementDriveRepository.saveAll(List.of(d1, d2, d3, d4));

        // ─────────────────────────────────────────────────────────────
        // Seed Notifications
        // ─────────────────────────────────────────────────────────────
        AppNotification notif1 = new AppNotification(
                "student@careersetu.in",
                "Application Shortlisted!",
                "TechCorp India reviewed your profile and moved your application for Cloud Native Engineer Intern to Shortlisted.",
                "APPLICATION", "HIGH", "/student/applications"
        );
        AppNotification notif2 = new AppNotification(
                "student@careersetu.in",
                "AI ATS Resume Studio Score",
                "Your ATS compatibility score achieved 91/100 for Backend Systems Engineer. 1 high-demand keyword recommended.",
                "AI_INSIGHT", "NORMAL", "/student/copilot"
        );
        AppNotification notif3 = new AppNotification(
                "student@careersetu.in",
                "New Opportunity Matching Your Profile",
                "Razorpay posted 'Software Engineer Intern - Payments' matching 94% of your verified skills.",
                "OPPORTUNITY", "NORMAL", "/student/opportunities"
        );
        AppNotification notif4 = new AppNotification(
                "student@careersetu.in",
                "Campus Placement Drive Announced",
                "TPO scheduled a 2026 Batch Campus Recruitment Drive with Infosys AI Systems. 14 NEP credits eligible.",
                "SYSTEM", "LOW", "/institution/drives"
        );
        notificationRepository.saveAll(List.of(notif1, notif2, notif3, notif4));

        // ─────────────────────────────────────────────────────────────
        // Seed Initial Verifiable Assessment Badges
        // ─────────────────────────────────────────────────────────────
        AssessmentSubmission sub1 = new AssessmentSubmission(
                "student@careersetu.in", "Aarav Sharma", "dsa",
                "Algorithmic Problem Solving", "java", 96,
                "class Solution { public int[] twoSum(int[] nums, int target) { ... } }",
                3, 3, "0x8f4d92a1c6e409b3e1f5789a2b8e3914a5c6d7e8f90123456789abcdef012345",
                "Algorithmic Problem Solving Verified Specialist", "PASSED"
        );
        assessmentSubmissionRepository.save(sub1);

        log.info("CareerSetu demo data seeding completed successfully! Mentors, Events, Interviews, TPO Cohort, Placement Drives, Notifications, and Assessment Badges initialized.");
    }
}
