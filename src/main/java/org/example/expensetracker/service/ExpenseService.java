package org.example.expensetracker.service;

import org.example.expensetracker.model.Expense;
import org.example.expensetracker.model.User;
import org.example.expensetracker.repository.ExpenseRepository;
import org.example.expensetracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ExpenseService {

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
        User user = getCurrentUser();
        expense.setUser(user);
        return expenseRepository.save(expense);
    }

    public Expense updateExpense(Long id, Expense expenseDetails) {
        User user = getCurrentUser();
        Expense expense = expenseRepository.findById(id)
                .filter(e -> e.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Expense not found or not yours"));
        // update fields...
        expense.setTitle(expenseDetails.getTitle());
        expense.setAmount(expenseDetails.getAmount());
        expense.setDate(expenseDetails.getDate());
        expense.setCategory(expenseDetails.getCategory());
        expense.setDescription(expenseDetails.getDescription());
        return expenseRepository.save(expense);
    }

    public void deleteExpense(Long id) {
        User user = getCurrentUser();
        Expense expense = expenseRepository.findById(id)
                .filter(e -> e.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Expense not found or not yours"));
        expenseRepository.delete(expense);
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
}