package org.example.expensetracker.service;

import org.example.expensetracker.model.Expense;
import org.example.expensetracker.model.User;
import org.example.expensetracker.repository.ExpenseRepository;
import org.example.expensetracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ExpenseService {
    private static final Logger logger = LoggerFactory.getLogger(ExpenseService.class);

    @Autowired
    private ExpenseRepository expenseRepository;
    @Autowired
    private UserRepository userRepository;

    public List<Expense> getAllExpenses() {
        User user = getCurrentUser();
        System.out.println("Current user: " + user.getUsername());
        return expenseRepository.findByUser(user);
    }

    public Optional<Expense> getExpenseById(Long id) {
        User user = getCurrentUser();
        return expenseRepository.findById(id)
                .filter(expense -> expense.getUser().getId().equals(user.getId()));
    }

    public Expense createExpense(Expense expense) {
        try {
            logger.info("Creating expense: {}", expense);
            
            // Validate expense
            if (expense.getUser() == null || expense.getUser().getId() == null) {
                throw new IllegalArgumentException("User ID is required");
            }
            
            if (expense.getAmount() == null || expense.getAmount().compareTo(java.math.BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("Expense amount must be greater than 0");
            }
            
            if (expense.getDate() == null) {
                throw new IllegalArgumentException("Date is required");
            }

            // Save the expense
            Expense savedExpense = expenseRepository.save(expense);
            logger.info("Expense created successfully with ID: {}", savedExpense.getId());
            return savedExpense;
        } catch (Exception e) {
            logger.error("Error creating expense: ", e);
            throw new RuntimeException("Failed to create expense: " + e.getMessage());
        }
    }

    public Expense updateExpense(Long id, Expense expense) {
        Expense existingExpense = expenseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Expense not found"));
        
        existingExpense.setTitle(expense.getTitle());
        existingExpense.setAmount(expense.getAmount());
        existingExpense.setDate(expense.getDate());
        existingExpense.setCategory(expense.getCategory());
        existingExpense.setDescription(expense.getDescription());
        
        return expenseRepository.save(existingExpense);
    }

    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }

    public User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<Expense> filterExpenses(String category, String startDate, String endDate) {
        User user = getCurrentUser();
        if (category != null && startDate != null && endDate != null) {
            return expenseRepository.findByUserAndCategoryAndDateBetween(
                    user, category, LocalDate.parse(startDate), LocalDate.parse(endDate));
        } else if (category != null) {
            return expenseRepository.findByUserAndCategory(user, category);
        } else if (startDate != null && endDate != null) {
            return expenseRepository.findByUserAndDateBetween(
                    user, LocalDate.parse(startDate), LocalDate.parse(endDate));
        } else {
            return expenseRepository.findByUser(user);
        }
    }

    public List<Expense> getUserExpenses(Long userId) {
        return expenseRepository.findByUserId(userId);
    }
}