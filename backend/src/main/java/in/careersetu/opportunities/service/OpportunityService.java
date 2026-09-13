package in.careersetu.opportunities.service;

import in.careersetu.common.exception.CareerSetuException;
import in.careersetu.companies.entity.Company;
import in.careersetu.companies.repository.CompanyRepository;
import in.careersetu.opportunities.dto.OpportunityDtos;
import in.careersetu.opportunities.entity.Opportunity;
import in.careersetu.opportunities.repository.OpportunityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OpportunityService {

    private final OpportunityRepository opportunityRepository;
    private final CompanyRepository companyRepository;

    public OpportunityService(OpportunityRepository opportunityRepository, CompanyRepository companyRepository) {
        this.opportunityRepository = opportunityRepository;
        this.companyRepository = companyRepository;
    }

    @Transactional(readOnly = true)
    public List<OpportunityDtos.OpportunityResponse> searchOpportunities(String search, String type, String workMode) {
        List<Opportunity> all = opportunityRepository.findAll();
        Map<UUID, String> companyNames = companyRepository.findAll().stream()
                .collect(Collectors.toMap(Company::getId, Company::getLegalName, (a, b) -> a));

        return all.stream()
                .filter(o -> {
                    if (type != null && !type.isBlank() && !type.equalsIgnoreCase("ALL")) {
                        if (!type.equalsIgnoreCase(o.getType())) return false;
                    }
                    if (workMode != null && !workMode.isBlank() && !workMode.equalsIgnoreCase("ALL")) {
                        if (!workMode.equalsIgnoreCase(o.getWorkMode())) return false;
                    }
                    if (search != null && !search.isBlank()) {
                        String q = search.toLowerCase().trim();
                        boolean titleMatches = o.getTitle() != null && o.getTitle().toLowerCase().contains(q);
                        boolean descMatches = o.getDescription() != null && o.getDescription().toLowerCase().contains(q);
                        boolean cityMatches = o.getLocationCity() != null && o.getLocationCity().toLowerCase().contains(q);
                        String compName = companyNames.get(o.getCompanyId());
                        boolean compMatches = compName != null && compName.toLowerCase().contains(q);
                        return titleMatches || descMatches || cityMatches || compMatches;
                    }
                    return true;
                })
                .map(o -> mapToResponse(o, companyNames.get(o.getCompanyId())))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OpportunityDtos.OpportunityResponse getOpportunityById(UUID id) {
        Opportunity opp = opportunityRepository.findById(id)
                .orElseThrow(() -> CareerSetuException.notFound("OPPORTUNITY", id.toString()));
        String companyName = companyRepository.findById(opp.getCompanyId())
                .map(Company::getLegalName)
                .orElse("Partner Company");
        return mapToResponse(opp, companyName);
    }

    @Transactional
    public OpportunityDtos.OpportunityResponse createOpportunity(UUID postedBy, OpportunityDtos.CreateOpportunityRequest req) {
        UUID compId = req.companyId();
        if (compId == null) {
            List<Company> companies = companyRepository.findAll();
            if (!companies.isEmpty()) {
                compId = companies.get(0).getId();
            } else {
                Company c = new Company();
                c.setLegalName("TechCorp India");
                c = companyRepository.save(c);
                compId = c.getId();
            }
        }

        Opportunity opp = new Opportunity();
        opp.setPostedBy(postedBy);
        opp.setCompanyId(compId);
        opp.setTitle(req.title());
        opp.setType(req.type() != null ? req.type() : "INTERNSHIP");
        opp.setDescription(req.description());
        opp.setLocationCity(req.locationCity() != null ? req.locationCity() : "Remote");
        opp.setLocationState(req.locationState() != null ? req.locationState() : "India");
        opp.setWorkMode(req.workMode() != null ? req.workMode() : "HYBRID");
        opp.setStipendMin(req.stipendMin());
        opp.setStipendMax(req.stipendMax());
        opp.setSalaryMin(req.salaryMin());
        opp.setSalaryMax(req.salaryMax());
        opp.setOpenings(req.openings() != null ? req.openings() : 1);
        opp.setDurationWeeks(req.durationWeeks());
        opp.setMinCgpa(req.minCgpa());
        opp.setApplicationDeadline(LocalDate.now().plusMonths(1));
        opp.setStatus("PUBLISHED");

        Opportunity saved = opportunityRepository.save(opp);
        String companyName = companyRepository.findById(compId).map(Company::getLegalName).orElse("Partner Company");
        return mapToResponse(saved, companyName);
    }

    @Transactional
    public OpportunityDtos.OpportunityResponse closeOpportunity(UUID id) {
        Opportunity opp = opportunityRepository.findById(id)
                .orElseThrow(() -> CareerSetuException.notFound("OPPORTUNITY", id.toString()));
        opp.setStatus("CLOSED");
        Opportunity saved = opportunityRepository.save(opp);
        String companyName = companyRepository.findById(opp.getCompanyId())
                .map(Company::getLegalName)
                .orElse("Partner Company");
        return mapToResponse(saved, companyName);
    }

    private OpportunityDtos.OpportunityResponse mapToResponse(Opportunity o, String companyName) {
        return new OpportunityDtos.OpportunityResponse(
                o.getId(),
                o.getCompanyId(),
                o.getPostedBy(),
                o.getTitle(),
                o.getSlug(),
                o.getType(),
                o.getDescription(),
                o.getLocationCity(),
                o.getLocationState(),
                o.getWorkMode(),
                o.getStipendMin(),
                o.getStipendMax(),
                o.getSalaryMin(),
                o.getSalaryMax(),
                o.getCurrency(),
                o.getIsPaid(),
                o.getDurationWeeks(),
                o.getApplicationDeadline(),
                o.getMinCgpa(),
                o.getOpenings(),
                o.getApplicationsCount(),
                o.getStatus(),
                o.getIsFeatured(),
                o.getCreatedAt(),
                companyName != null ? companyName : "TechCorp India"
        );
    }
}
