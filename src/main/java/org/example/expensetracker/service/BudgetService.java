package org.example.expensetracker.service;

import org.example.expensetracker.model.Budget;
import org.example.expensetracker.model.Expense;
import org.example.expensetracker.repository.BudgetRepository;
import org.example.expensetracker.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class BudgetService {
    private static final Logger logger = LoggerFactory.getLogger(BudgetService.class);

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    public Budget createBudget(Budget budget) {
        try {
            logger.info("Creating budget: {}", budget);
            
            // Validate budget
            if (budget.getUser() == null || budget.getUser().getId() == null) {
                throw new IllegalArgumentException("User ID is required");
            }
            
            if (budget.getAmount() == null || budget.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("Budget amount must be greater than 0");
            }
            
            if (budget.getStartDate() == null || budget.getEndDate() == null) {
                throw new IllegalArgumentException("Start date and end date are required");
            }
            
            if (budget.getStartDate().isAfter(budget.getEndDate())) {
                throw new IllegalArgumentException("Start date must be before end date");
            }

            // Save the budget
            Budget savedBudget = budgetRepository.save(budget);
            logger.info("Budget created successfully with ID: {}", savedBudget.getId());
            return savedBudget;
        } catch (Exception e) {
            logger.error("Error creating budget: ", e);
            throw new RuntimeException("Failed to create budget: " + e.getMessage());
        }
    }

    public List<Budget> getUserBudgets(Long userId) {
        return budgetRepository.findByUserId(userId);
    }

    public Budget updateBudget(Long id, Budget budget) {
        Budget existingBudget = budgetRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Budget not found"));
        
        existingBudget.setAmount(budget.getAmount());
        existingBudget.setCategory(budget.getCategory());
        existingBudget.setStartDate(budget.getStartDate());
        existingBudget.setEndDate(budget.getEndDate());
        existingBudget.setDescription(budget.getDescription());
        
        return budgetRepository.save(existingBudget);
    }

    public void deleteBudget(Long id) {
        budgetRepository.deleteById(id);
    }

    public Map<String, Object> getBudgetStatus(Long userId, String category) {
        Budget budget = budgetRepository.findByUserIdAndCategory(userId, category)
            .stream()
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Budget not found"));

        LocalDate startDate = budget.getStartDate();
        LocalDate endDate = budget.getEndDate();

        List<Expense> expenses = expenseRepository.findByUserIdAndCategoryAndDateBetween(
            userId, category, startDate, endDate);

        BigDecimal totalSpent = expenses.stream()
            .map(Expense::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal remaining = budget.getAmount().subtract(totalSpent);
        double percentageUsed = (totalSpent.doubleValue() / budget.getAmount().doubleValue()) * 100;

        return Map.of(
            "budget", budget,
            "totalSpent", totalSpent,
            "remaining", remaining,
            "percentageUsed", percentageUsed,
            "expenses", expenses
        );
    }
} 